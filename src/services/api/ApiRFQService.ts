import { BaseService } from '@/services/base/BaseService';
import { RFQRecord, LineItem } from '@/types/rfq';
import { ApiResponse } from '@/types/api';
import { API_ENDPOINTS } from '@/config/api';
import { apiClient } from '@/services/base/ApiClient';

// API-based RFQ Service (for production)
export class ApiRFQService extends BaseService<RFQRecord> {
  protected readonly endpoint = API_ENDPOINTS.rfqs;

  // Get RFQs with enhanced filtering
  async getRFQs(
    filters: any = {},
    sort: any = { field: 'publishDate', direction: 'desc' },
    pagination: any = { page: 1, limit: 10 }
  ): Promise<ApiResponse<any>> {
    const params = {
      ...filters,
      sort: `${sort.field}:${sort.direction}`,
      page: pagination.page,
      limit: pagination.limit
    };
    
    return this.getList(params);
  }

  // Get single RFQ
  async getRFQ(id: string): Promise<ApiResponse<RFQRecord>> {
    return this.getById(id);
  }

  // Create RFQ
  async createRFQ(rfq: Omit<RFQRecord, 'id' | 'lastUpdated'>): Promise<ApiResponse<RFQRecord>> {
    // Map to base service expected format
    const createData = rfq as any;
    return this.create(createData);
  }

  // Update RFQ
  async updateRFQ(id: string, updates: Partial<RFQRecord>): Promise<ApiResponse<RFQRecord>> {
    return this.update(id, updates);
  }

  // Delete RFQ
  async deleteRFQ(id: string): Promise<ApiResponse<void>> {
    return this.delete(id);
  }

  // Line item operations
  async updateLineItem(rfqId: string, lineItemId: string, updates: Partial<LineItem>): Promise<ApiResponse<LineItem>> {
    return apiClient.patch(`${API_ENDPOINTS.rfqLineItems(rfqId)}/${lineItemId}`, updates);
  }

  async createLineItem(rfqId: string, lineItem: Omit<LineItem, 'id'>): Promise<ApiResponse<LineItem>> {
    return apiClient.post(API_ENDPOINTS.rfqLineItems(rfqId), lineItem);
  }

  async deleteLineItem(rfqId: string, lineItemId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${API_ENDPOINTS.rfqLineItems(rfqId)}/${lineItemId}`);
  }

  // Bulk operations
  async bulkDeleteRFQs(ids: string[]): Promise<ApiResponse<void>> {
    return this.bulkDelete(ids);
  }

  async bulkUpdateRFQs(updates: Array<{ id: string; data: Partial<RFQRecord> }>): Promise<ApiResponse<RFQRecord[]>> {
    return this.bulkUpdate(updates);
  }

  // Search functionality
  async searchRFQs(query: string, filters: any = {}): Promise<ApiResponse<RFQRecord[]>> {
    return this.search(query, filters);
  }

  // Statistics
  async getStats(): Promise<ApiResponse<any>> {
    return apiClient.get(`${this.endpoint}/stats`);
  }

  // Export
  async exportRFQs(format: 'csv' | 'excel' | 'json' = 'json', filters: any = {}): Promise<ApiResponse<string>> {
    return this.export(format, filters);
  }

  // Bulk actions for line items
  async bulkUpdateLineItems(rfqId: string, updates: Array<{ id: string; data: Partial<LineItem> }>): Promise<ApiResponse<LineItem[]>> {
    return apiClient.post(`${API_ENDPOINTS.rfqLineItems(rfqId)}/bulk-update`, { updates });
  }

  async bulkDeleteLineItems(rfqId: string, ids: string[]): Promise<ApiResponse<void>> {
    return apiClient.post(`${API_ENDPOINTS.rfqLineItems(rfqId)}/bulk-delete`, { ids });
  }

  // Advanced filtering and reporting
  async getRFQsByDateRange(startDate: string, endDate: string): Promise<ApiResponse<RFQRecord[]>> {
    const params = {
      dateFrom: startDate,
      dateTo: endDate
    };
    return apiClient.get(this.endpoint, params);
  }

  async getRFQsByStatus(status: string): Promise<ApiResponse<RFQRecord[]>> {
    const params = { status };
    return apiClient.get(this.endpoint, params);
  }

  async getRFQsByClient(clientName: string): Promise<ApiResponse<RFQRecord[]>> {
    const params = { client: clientName };
    return apiClient.get(this.endpoint, params);
  }
}