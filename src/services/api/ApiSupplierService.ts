import { BaseService } from '@/services/base/BaseService';
import { Supplier, Manufacturer, SupplierStats } from '@/types/suppliers';
import { ApiResponse } from '@/types/api';
import { API_ENDPOINTS } from '@/config/api';
import { apiClient } from '@/services/base/ApiClient';

// API-based Supplier Service (for production)
export class ApiSupplierService extends BaseService<Supplier> {
  protected readonly endpoint = API_ENDPOINTS.suppliers;

  // Get suppliers with enhanced filtering
  async getSuppliers(
    filters: any = {},
    sort: any = { field: 'name', direction: 'asc' },
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

  // Get single supplier
  async getSupplier(id: string): Promise<ApiResponse<Supplier>> {
    return this.getById(id);
  }

  // Create supplier
  async createSupplier(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Supplier>> {
    return this.create(supplier);
  }

  // Update supplier
  async updateSupplier(id: string, updates: Partial<Supplier>): Promise<ApiResponse<Supplier>> {
    return this.update(id, updates);
  }

  // Delete supplier
  async deleteSupplier(id: string): Promise<ApiResponse<void>> {
    return this.delete(id);
  }

  // Manufacturers operations
  async getManufacturers(
    filters: any = {},
    sort: any = { field: 'name', direction: 'asc' },
    pagination: any = { page: 1, limit: 10 }
  ): Promise<ApiResponse<any>> {
    const params = {
      ...filters,
      sort: `${sort.field}:${sort.direction}`,
      page: pagination.page,
      limit: pagination.limit
    };
    
    return apiClient.get(API_ENDPOINTS.manufacturers, params);
  }

  async getManufacturer(id: string): Promise<ApiResponse<Manufacturer>> {
    return apiClient.get(API_ENDPOINTS.manufacturer(id));
  }

  async createManufacturer(manufacturer: Omit<Manufacturer, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Manufacturer>> {
    return apiClient.post(API_ENDPOINTS.manufacturers, manufacturer);
  }

  async updateManufacturer(id: string, updates: Partial<Manufacturer>): Promise<ApiResponse<Manufacturer>> {
    return apiClient.patch(API_ENDPOINTS.manufacturer(id), updates);
  }

  async deleteManufacturer(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(API_ENDPOINTS.manufacturer(id));
  }

  // Bulk operations
  async bulkAction(action: any): Promise<ApiResponse<void>> {
    return apiClient.post(API_ENDPOINTS.bulkAction, action);
  }

  // Statistics
  async getStats(): Promise<ApiResponse<SupplierStats>> {
    return apiClient.get(API_ENDPOINTS.stats);
  }

  // Export
  async exportData(type: 'manufacturers' | 'suppliers' | 'all'): Promise<ApiResponse<string>> {
    return apiClient.get(API_ENDPOINTS.export, { type });
  }
}