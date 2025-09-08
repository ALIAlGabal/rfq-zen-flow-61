import { RFQRecord, LineItem, RFQStatus, LineItemStatus } from '@/types/rfq';
import { ApiResponse, PaginationParams, FilterParams, SortParams, PaginatedResponse } from '@/types/suppliers';
import { mockRFQs, mockRFQStats } from '@/data/mockRFQs';

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Extended filter params for RFQs
interface RFQFilterParams extends FilterParams {
  client?: string;
  rfqNo?: string;
  dateFrom?: string;
  dateTo?: string;
}

class RFQService {
  private rfqs: RFQRecord[] = [...mockRFQs];

  // Helper function to filter and sort RFQs
  private filterAndSort(
    data: RFQRecord[],
    filters: RFQFilterParams,
    sort: SortParams,
    pagination: PaginationParams
  ): PaginatedResponse<RFQRecord> {
    let filtered = [...data];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(rfq => 
        rfq.rfqNo.toLowerCase().includes(searchLower) ||
        rfq.client.toLowerCase().includes(searchLower) ||
        rfq.lineItems.some(item => 
          item.itemId.toLowerCase().includes(searchLower) ||
          item.manufacturer.toLowerCase().includes(searchLower) ||
          item.supplier.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(rfq => rfq.status === filters.status);
    }

    // Apply client filter
    if (filters.client) {
      filtered = filtered.filter(rfq => rfq.client.toLowerCase().includes(filters.client!.toLowerCase()));
    }

    // Apply RFQ number filter
    if (filters.rfqNo) {
      filtered = filtered.filter(rfq => rfq.rfqNo.toLowerCase().includes(filters.rfqNo!.toLowerCase()));
    }

    // Apply date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(rfq => new Date(rfq.publishDate) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filtered = filtered.filter(rfq => new Date(rfq.publishDate) <= toDate);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sort.field as keyof RFQRecord];
      const bValue = b[sort.field as keyof RFQRecord];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        // For date strings, convert to Date for comparison
        if (sort.field === 'publishDate' || sort.field === 'bidDate' || sort.field === 'lastUpdated') {
          const aDate = new Date(aValue);
          const bDate = new Date(bValue);
          const comparison = aDate.getTime() - bDate.getTime();
          return sort.direction === 'asc' ? comparison : -comparison;
        }
        
        const comparison = aValue.localeCompare(bValue);
        return sort.direction === 'asc' ? comparison : -comparison;
      }
      
      return 0;
    });

    // Apply pagination
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedData = filtered.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / pagination.limit)
      }
    };
  }

  // Get RFQs with filtering and pagination
  async getRFQs(
    filters: RFQFilterParams = {},
    sort: SortParams = { field: 'lastUpdated', direction: 'desc' },
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<ApiResponse<PaginatedResponse<RFQRecord>>> {
    await delay(500);
    
    try {
      const result = this.filterAndSort(this.rfqs, filters, sort, pagination);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: 'Failed to fetch RFQs' };
    }
  }

  // Get single RFQ
  async getRFQ(id: string): Promise<ApiResponse<RFQRecord>> {
    await delay(200);
    
    const rfq = this.rfqs.find(r => r.id === id);
    if (!rfq) {
      return { success: false, error: 'RFQ not found' };
    }
    
    return { success: true, data: rfq };
  }

  // Create new RFQ
  async createRFQ(rfq: Omit<RFQRecord, 'id' | 'lastUpdated'>): Promise<ApiResponse<RFQRecord>> {
    await delay(800);
    
    try {
      const newRFQ: RFQRecord = {
        ...rfq,
        id: `rfq-${Date.now()}`,
        lastUpdated: new Date().toISOString()
      };
      
      this.rfqs.push(newRFQ);
      return { success: true, data: newRFQ, message: 'RFQ created successfully' };
    } catch (error) {
      return { success: false, error: 'Failed to create RFQ' };
    }
  }

  // Update RFQ
  async updateRFQ(id: string, updates: Partial<RFQRecord>): Promise<ApiResponse<RFQRecord>> {
    await delay(600);
    
    const index = this.rfqs.findIndex(r => r.id === id);
    if (index === -1) {
      return { success: false, error: 'RFQ not found' };
    }
    
    try {
      this.rfqs[index] = {
        ...this.rfqs[index],
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      
      return { success: true, data: this.rfqs[index], message: 'RFQ updated successfully' };
    } catch (error) {
      return { success: false, error: 'Failed to update RFQ' };
    }
  }

  // Delete RFQ
  async deleteRFQ(id: string): Promise<ApiResponse<void>> {
    await delay(400);
    
    const index = this.rfqs.findIndex(r => r.id === id);
    if (index === -1) {
      return { success: false, error: 'RFQ not found' };
    }
    
    try {
      this.rfqs.splice(index, 1);
      return { success: true, message: 'RFQ deleted successfully' };
    } catch (error) {
      return { success: false, error: 'Failed to delete RFQ' };
    }
  }

  // Update line item status
  async updateLineItemStatus(rfqId: string, lineItemId: string, status: LineItemStatus): Promise<ApiResponse<LineItem>> {
    await delay(300);
    
    const rfq = this.rfqs.find(r => r.id === rfqId);
    if (!rfq) {
      return { success: false, error: 'RFQ not found' };
    }
    
    const lineItem = rfq.lineItems.find(item => item.id === lineItemId);
    if (!lineItem) {
      return { success: false, error: 'Line item not found' };
    }
    
    try {
      lineItem.status = status;
      rfq.lastUpdated = new Date().toISOString();
      
      return { success: true, data: lineItem, message: 'Line item status updated successfully' };
    } catch (error) {
      return { success: false, error: 'Failed to update line item status' };
    }
  }

  // Get RFQ statistics
  async getRFQStats(): Promise<ApiResponse<typeof mockRFQStats>> {
    await delay(300);
    
    try {
      const stats = {
        totalRFQs: this.rfqs.length,
        openRFQs: this.rfqs.filter(r => r.status === 'open').length,
        submittedRFQs: this.rfqs.filter(r => r.status === 'submitted').length,
        closedRFQs: this.rfqs.filter(r => r.status === 'closed').length,
        pendingRFQs: this.rfqs.filter(r => r.status === 'pending').length,
        totalLineItems: this.rfqs.reduce((sum, rfq) => sum + rfq.lineItems.length, 0),
        averageLineItemsPerRFQ: this.rfqs.reduce((sum, rfq) => sum + rfq.lineItems.length, 0) / this.rfqs.length || 0
      };
      
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: 'Failed to fetch RFQ statistics' };
    }
  }

  // Export RFQ data
  async exportRFQs(format: 'csv' | 'excel' | 'json' = 'json'): Promise<ApiResponse<string>> {
    await delay(1500);
    
    try {
      // In a real implementation, this would generate and return a download URL
      const exportUrl = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.rfqs, null, 2))}`;
      
      return { success: true, data: exportUrl, message: 'Export completed successfully' };
    } catch (error) {
      return { success: false, error: 'Failed to export RFQ data' };
    }
  }
}

export const rfqService = new RFQService();