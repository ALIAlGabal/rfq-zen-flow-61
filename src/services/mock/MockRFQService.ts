import { RFQRecord, LineItem } from '@/types/rfq';
import { mockRFQs, mockRFQStats } from '@/data/mockRFQs';
import { ApiResponse, ApiPaginatedResponse, ApiFilterParams, ApiPaginationParams } from '@/types/api';

// Mock RFQ Service (for development and testing)
export class MockRFQService {
  private rfqs: RFQRecord[] = [...mockRFQs];

  // Simulate API delay
  private delay(ms: number = 200): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock success response
  private mockResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message: message || 'Operation completed successfully',
      timestamp: new Date().toISOString()
    };
  }

  // Mock error response
  private mockError(error: string): ApiResponse<any> {
    return {
      success: false,
      error,
      timestamp: new Date().toISOString()
    };
  }

  // Get paginated RFQs with filtering
  async getRFQs(
    filters: ApiFilterParams = {},
    sort: any = { field: 'publishDate', direction: 'desc' },
    pagination: ApiPaginationParams = { page: 1, limit: 10 }
  ): Promise<ApiResponse<ApiPaginatedResponse<RFQRecord>>> {
    await this.delay();

    try {
      let filteredRFQs = [...this.rfqs];

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        filteredRFQs = filteredRFQs.filter(rfq => rfq.status === filters.status);
      }
      if (filters.client) {
        filteredRFQs = filteredRFQs.filter(rfq => 
          rfq.client.toLowerCase().includes(filters.client!.toLowerCase())
        );
      }
      if (filters.rfqNo) {
        filteredRFQs = filteredRFQs.filter(rfq => 
          rfq.rfqNo.toLowerCase().includes(filters.rfqNo!.toLowerCase())
        );
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredRFQs = filteredRFQs.filter(rfq =>
          rfq.rfqNo.toLowerCase().includes(searchLower) ||
          rfq.client.toLowerCase().includes(searchLower) ||
          rfq.lineItems.some(item =>
            item.manufacturer.toLowerCase().includes(searchLower) ||
            item.supplier.toLowerCase().includes(searchLower) ||
            item.itemId.toLowerCase().includes(searchLower)
          )
        );
      }

      // Apply sorting
      filteredRFQs.sort((a, b) => {
        const aValue = a[sort.field as keyof RFQRecord] as string;
        const bValue = b[sort.field as keyof RFQRecord] as string;
        const comparison = aValue.localeCompare(bValue);
        return sort.direction === 'desc' ? -comparison : comparison;
      });

      // Apply pagination
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedRFQs = filteredRFQs.slice(startIndex, endIndex);

      const result: ApiPaginatedResponse<RFQRecord> = {
        data: paginatedRFQs,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: filteredRFQs.length,
          totalPages: Math.ceil(filteredRFQs.length / pagination.limit),
          hasNext: endIndex < filteredRFQs.length,
          hasPrev: pagination.page > 1
        }
      };

      return this.mockResponse(result);
    } catch (error) {
      return this.mockError('Failed to fetch RFQs');
    }
  }

  // Get single RFQ
  async getRFQ(id: string): Promise<ApiResponse<RFQRecord>> {
    await this.delay();

    try {
      const rfq = this.rfqs.find(r => r.id === id);
      if (!rfq) {
        return this.mockError('RFQ not found');
      }
      return this.mockResponse(rfq);
    } catch (error) {
      return this.mockError('Failed to fetch RFQ');
    }
  }

  // Create new RFQ
  async createRFQ(rfqData: Omit<RFQRecord, 'id' | 'lastUpdated'>): Promise<ApiResponse<RFQRecord>> {
    await this.delay();

    try {
      const newRFQ: RFQRecord = {
        ...rfqData,
        id: `rfq-${Date.now()}`,
        lastUpdated: new Date().toISOString()
      };

      this.rfqs.unshift(newRFQ);
      return this.mockResponse(newRFQ, 'RFQ created successfully');
    } catch (error) {
      return this.mockError('Failed to create RFQ');
    }
  }

  // Update RFQ
  async updateRFQ(id: string, updates: Partial<RFQRecord>): Promise<ApiResponse<RFQRecord>> {
    await this.delay();

    try {
      const index = this.rfqs.findIndex(r => r.id === id);
      if (index === -1) {
        return this.mockError('RFQ not found');
      }

      this.rfqs[index] = {
        ...this.rfqs[index],
        ...updates,
        lastUpdated: new Date().toISOString()
      };

      return this.mockResponse(this.rfqs[index], 'RFQ updated successfully');
    } catch (error) {
      return this.mockError('Failed to update RFQ');
    }
  }

  // Delete RFQ
  async deleteRFQ(id: string): Promise<ApiResponse<void>> {
    await this.delay();

    try {
      const index = this.rfqs.findIndex(r => r.id === id);
      if (index === -1) {
        return this.mockError('RFQ not found');
      }

      this.rfqs.splice(index, 1);
      return this.mockResponse(undefined, 'RFQ deleted successfully');
    } catch (error) {
      return this.mockError('Failed to delete RFQ');
    }
  }

  // Update line item
  async updateLineItem(rfqId: string, lineItemId: string, updates: Partial<LineItem>): Promise<ApiResponse<LineItem>> {
    await this.delay();

    try {
      const rfq = this.rfqs.find(r => r.id === rfqId);
      if (!rfq) {
        return this.mockError('RFQ not found');
      }

      const lineItemIndex = rfq.lineItems.findIndex(item => item.id === lineItemId);
      if (lineItemIndex === -1) {
        return this.mockError('Line item not found');
      }

      rfq.lineItems[lineItemIndex] = {
        ...rfq.lineItems[lineItemIndex],
        ...updates
      };

      rfq.lastUpdated = new Date().toISOString();
      
      return this.mockResponse(rfq.lineItems[lineItemIndex], 'Line item updated successfully');
    } catch (error) {
      return this.mockError('Failed to update line item');
    }
  }

  // Bulk operations
  async bulkDeleteRFQs(ids: string[]): Promise<ApiResponse<void>> {
    await this.delay();

    try {
      this.rfqs = this.rfqs.filter(rfq => !ids.includes(rfq.id));
      return this.mockResponse(undefined, `${ids.length} RFQs deleted successfully`);
    } catch (error) {
      return this.mockError('Failed to delete RFQs');
    }
  }

  async bulkUpdateRFQs(updates: Array<{ id: string; data: Partial<RFQRecord> }>): Promise<ApiResponse<RFQRecord[]>> {
    await this.delay();

    try {
      const updatedRFQs: RFQRecord[] = [];

      for (const update of updates) {
        const index = this.rfqs.findIndex(r => r.id === update.id);
        if (index !== -1) {
          this.rfqs[index] = {
            ...this.rfqs[index],
            ...update.data,
            lastUpdated: new Date().toISOString()
          };
          updatedRFQs.push(this.rfqs[index]);
        }
      }

      return this.mockResponse(updatedRFQs, `${updatedRFQs.length} RFQs updated successfully`);
    } catch (error) {
      return this.mockError('Failed to update RFQs');
    }
  }

  // Search RFQs
  async searchRFQs(query: string, filters: ApiFilterParams = {}): Promise<ApiResponse<RFQRecord[]>> {
    await this.delay();

    try {
      const searchLower = query.toLowerCase();
      let results = this.rfqs.filter(rfq =>
        rfq.rfqNo.toLowerCase().includes(searchLower) ||
        rfq.client.toLowerCase().includes(searchLower) ||
        rfq.lineItems.some(item =>
          item.manufacturer.toLowerCase().includes(searchLower) ||
          item.supplier.toLowerCase().includes(searchLower) ||
          item.itemId.toLowerCase().includes(searchLower)
        )
      );

      // Apply additional filters
      if (filters.status && filters.status !== 'all') {
        results = results.filter(rfq => rfq.status === filters.status);
      }

      return this.mockResponse(results);
    } catch (error) {
      return this.mockError('Failed to search RFQs');
    }
  }

  // Get RFQ statistics
  async getStats(): Promise<ApiResponse<typeof mockRFQStats>> {
    await this.delay();

    try {
      // Calculate current stats from live data
      const currentStats = {
        totalRFQs: this.rfqs.length,
        openRFQs: this.rfqs.filter(r => r.status === 'open').length,
        submittedRFQs: this.rfqs.filter(r => r.status === 'submitted').length,
        closedRFQs: this.rfqs.filter(r => r.status === 'closed').length,
        pendingRFQs: this.rfqs.filter(r => r.status === 'pending').length,
        totalLineItems: this.rfqs.reduce((sum, rfq) => sum + rfq.lineItems.length, 0),
        averageLineItemsPerRFQ: this.rfqs.length > 0 
          ? this.rfqs.reduce((sum, rfq) => sum + rfq.lineItems.length, 0) / this.rfqs.length 
          : 0
      };

      return this.mockResponse(currentStats);
    } catch (error) {
      return this.mockError('Failed to fetch RFQ statistics');
    }
  }

  // Export RFQs
  async exportRFQs(format: 'csv' | 'excel' | 'json' = 'json', filters: ApiFilterParams = {}): Promise<ApiResponse<string>> {
    await this.delay();

    try {
      // In a real implementation, this would generate the actual export file
      const exportUrl = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.rfqs, null, 2))}`;
      return this.mockResponse(exportUrl, 'Export generated successfully');
    } catch (error) {
      return this.mockError('Failed to export RFQs');
    }
  }
}