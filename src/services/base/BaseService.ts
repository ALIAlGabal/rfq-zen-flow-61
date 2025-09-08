import { ApiResponse, ApiPaginatedResponse, ApiFilterParams, ApiPaginationParams } from '@/types/api';
import { apiClient } from './ApiClient';

// Abstract base service class for common CRUD operations
export abstract class BaseService<T, TCreate = Omit<T, 'id' | 'createdAt' | 'updatedAt'>, TUpdate = Partial<T>> {
  protected abstract readonly endpoint: string;
  
  // Get paginated list
  async getList(
    filters: ApiFilterParams = {},
    pagination: ApiPaginationParams = { page: 1, limit: 10 }
  ): Promise<ApiResponse<ApiPaginatedResponse<T>>> {
    const params = {
      ...filters,
      ...pagination
    };
    
    return apiClient.get<ApiPaginatedResponse<T>>(this.endpoint, params);
  }

  // Get single item by ID
  async getById(id: string): Promise<ApiResponse<T>> {
    return apiClient.get<T>(`${this.endpoint}/${id}`);
  }

  // Create new item
  async create(data: TCreate): Promise<ApiResponse<T>> {
    return apiClient.post<T, TCreate>(this.endpoint, data);
  }

  // Update existing item
  async update(id: string, data: TUpdate): Promise<ApiResponse<T>> {
    return apiClient.patch<T, TUpdate>(`${this.endpoint}/${id}`, data);
  }

  // Delete item
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`);
  }

  // Bulk operations
  async bulkDelete(ids: string[]): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.endpoint}/bulk-delete`, { ids });
  }

  async bulkUpdate(updates: Array<{ id: string; data: TUpdate }>): Promise<ApiResponse<T[]>> {
    return apiClient.post<T[]>(`${this.endpoint}/bulk-update`, { updates });
  }

  // Search functionality
  async search(query: string, filters: ApiFilterParams = {}): Promise<ApiResponse<T[]>> {
    const params = {
      search: query,
      ...filters
    };
    
    return apiClient.get<T[]>(`${this.endpoint}/search`, params);
  }

  // Export functionality
  async export(format: 'csv' | 'excel' | 'json' = 'json', filters: ApiFilterParams = {}): Promise<ApiResponse<string>> {
    const params = {
      format,
      ...filters
    };
    
    return apiClient.get<string>(`${this.endpoint}/export`, params);
  }
}