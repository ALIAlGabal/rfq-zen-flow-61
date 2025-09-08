import { 
  Manufacturer, 
  Supplier, 
  PaginatedResponse, 
  ApiResponse, 
  FilterParams, 
  SortParams, 
  PaginationParams,
  BulkAction,
  SupplierStats
} from '@/types/suppliers';
import { mockManufacturers, mockSuppliers, mockStats } from '@/data/mockSuppliers';

// Mock API delay to simulate real API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class SupplierService {
  private manufacturers: Manufacturer[] = [...mockManufacturers];
  private suppliers: Supplier[] = [...mockSuppliers];

  // Helper function to filter and sort data
  private filterAndSort<T extends Manufacturer | Supplier>(
    data: T[],
    filters: FilterParams,
    sort: SortParams,
    pagination: PaginationParams
  ): PaginatedResponse<T> {
    let filtered = [...data];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.contacts.some(contact => 
          contact.name.toLowerCase().includes(searchLower) ||
          contact.email.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    // Apply industry/type filter
    if (filters.industry) {
      filtered = filtered.filter(item => {
        if ('industry' in item) {
          return item.industry === filters.industry;
        }
        if ('type' in item) {
          return item.type === filters.industry;
        }
        return false;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sort.direction === 'asc' ? comparison : -comparison;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        // For date strings, convert to Date for comparison
        if (sort.field === 'createdAt' || sort.field === 'updatedAt' || sort.field === 'lastContactDate') {
          const aDate = new Date(aValue);
          const bDate = new Date(bValue);
          const comparison = aDate.getTime() - bDate.getTime();
          return sort.direction === 'asc' ? comparison : -comparison;
        }
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

  // Manufacturers
  async getManufacturers(
    filters: FilterParams = {},
    sort: SortParams = { field: 'name', direction: 'asc' },
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<ApiResponse<PaginatedResponse<Manufacturer>>> {
    await delay(500);
    
    try {
      const result = this.filterAndSort(this.manufacturers, filters, sort, pagination);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: 'Failed to fetch manufacturers' };
    }
  }

  async getManufacturer(id: string): Promise<ApiResponse<Manufacturer>> {
    await delay(200);
    
    const manufacturer = this.manufacturers.find(m => m.id === id);
    if (!manufacturer) {
      return { success: false, error: 'Manufacturer not found' };
    }
    
    return { success: true, data: manufacturer };
  }

  async createManufacturer(manufacturer: Omit<Manufacturer, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Manufacturer>> {
    await delay(800);
    
    try {
      const newManufacturer: Manufacturer = {
        ...manufacturer,
        id: `mfg-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.manufacturers.push(newManufacturer);
      return { success: true, data: newManufacturer, message: 'Manufacturer created successfully' };
    } catch (error) {
      return { success: false, error: 'Failed to create manufacturer' };
    }
  }

  async updateManufacturer(id: string, updates: Partial<Manufacturer>): Promise<ApiResponse<Manufacturer>> {
    await delay(600);
    
    const index = this.manufacturers.findIndex(m => m.id === id);
    if (index === -1) {
      return { success: false, error: 'Manufacturer not found' };
    }
    
    try {
      this.manufacturers[index] = {
        ...this.manufacturers[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      return { success: true, data: this.manufacturers[index], message: 'Manufacturer updated successfully' };
    } catch (error) {
      return { success: false, error: 'Failed to update manufacturer' };
    }
  }

  async deleteManufacturer(id: string): Promise<ApiResponse<void>> {
    await delay(400);
    
    const index = this.manufacturers.findIndex(m => m.id === id);
    if (index === -1) {
      return { success: false, error: 'Manufacturer not found' };
    }
    
    try {
      this.manufacturers.splice(index, 1);
      
      // Remove references from suppliers
      this.suppliers.forEach(supplier => {
        supplier.linkedManufacturerIds = supplier.linkedManufacturerIds.filter(mId => mId !== id);
      });
      
      return { success: true, message: 'Manufacturer deleted successfully' };
    } catch (error) {
      return { success: false, error: 'Failed to delete manufacturer' };
    }
  }

  // Suppliers
  async getSuppliers(
    filters: FilterParams = {},
    sort: SortParams = { field: 'name', direction: 'asc' },
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<ApiResponse<PaginatedResponse<Supplier>>> {
    await delay(500);
    
    try {
      const result = this.filterAndSort(this.suppliers, filters, sort, pagination);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: 'Failed to fetch suppliers' };
    }
  }

  async getSupplier(id: string): Promise<ApiResponse<Supplier>> {
    await delay(200);
    
    const supplier = this.suppliers.find(s => s.id === id);
    if (!supplier) {
      return { success: false, error: 'Supplier not found' };
    }
    
    return { success: true, data: supplier };
  }

  async createSupplier(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Supplier>> {
    await delay(800);
    
    try {
      const newSupplier: Supplier = {
        ...supplier,
        id: `sup-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.suppliers.push(newSupplier);
      return { success: true, data: newSupplier, message: 'Supplier created successfully' };
    } catch (error) {
      return { success: false, error: 'Failed to create supplier' };
    }
  }

  async updateSupplier(id: string, updates: Partial<Supplier>): Promise<ApiResponse<Supplier>> {
    await delay(600);
    
    const index = this.suppliers.findIndex(s => s.id === id);
    if (index === -1) {
      return { success: false, error: 'Supplier not found' };
    }
    
    try {
      this.suppliers[index] = {
        ...this.suppliers[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      return { success: true, data: this.suppliers[index], message: 'Supplier updated successfully' };
    } catch (error) {
      return { success: false, error: 'Failed to update supplier' };
    }
  }

  async deleteSupplier(id: string): Promise<ApiResponse<void>> {
    await delay(400);
    
    const index = this.suppliers.findIndex(s => s.id === id);
    if (index === -1) {
      return { success: false, error: 'Supplier not found' };
    }
    
    try {
      this.suppliers.splice(index, 1);
      
      // Remove references from manufacturers
      this.manufacturers.forEach(manufacturer => {
        manufacturer.linkedSupplierIds = manufacturer.linkedSupplierIds.filter(sId => sId !== id);
      });
      
      return { success: true, message: 'Supplier deleted successfully' };
    } catch (error) {
      return { success: false, error: 'Failed to delete supplier' };
    }
  }

  // Bulk operations
  async bulkAction(action: BulkAction): Promise<ApiResponse<void>> {
    await delay(1000);
    
    try {
      switch (action.action) {
        case 'delete':
          action.ids.forEach(id => {
            this.manufacturers = this.manufacturers.filter(m => m.id !== id);
            this.suppliers = this.suppliers.filter(s => s.id !== id);
          });
          break;
        case 'activate':
          this.manufacturers.forEach(m => {
            if (action.ids.includes(m.id)) m.status = 'active';
          });
          this.suppliers.forEach(s => {
            if (action.ids.includes(s.id)) s.status = 'active';
          });
          break;
        case 'deactivate':
          this.manufacturers.forEach(m => {
            if (action.ids.includes(m.id)) m.status = 'inactive';
          });
          this.suppliers.forEach(s => {
            if (action.ids.includes(s.id)) s.status = 'inactive';
          });
          break;
      }
      
      return { success: true, message: `Bulk ${action.action} completed successfully` };
    } catch (error) {
      return { success: false, error: `Failed to perform bulk ${action.action}` };
    }
  }

  // Statistics
  async getStats(): Promise<ApiResponse<SupplierStats>> {
    await delay(300);
    
    try {
      const stats = {
        totalManufacturers: this.manufacturers.length,
        totalSuppliers: this.suppliers.length,
        activeManufacturers: this.manufacturers.filter(m => m.status === 'active').length,
        activeSuppliers: this.suppliers.filter(s => s.status === 'active').length,
        recentlyAdded: [...this.manufacturers, ...this.suppliers].filter(
          item => new Date(item.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
        pendingApproval: [...this.manufacturers, ...this.suppliers].filter(
          item => item.status === 'pending'
        ).length
      };
      
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: 'Failed to fetch statistics' };
    }
  }

  // Export functionality
  async exportData(type: 'manufacturers' | 'suppliers' | 'all'): Promise<ApiResponse<string>> {
    await delay(1500);
    
    try {
      let data: any[] = [];
      
      switch (type) {
        case 'manufacturers':
          data = this.manufacturers;
          break;
        case 'suppliers':
          data = this.suppliers;
          break;
        case 'all':
          data = [...this.manufacturers, ...this.suppliers];
          break;
      }
      
      // In a real implementation, this would generate and return a download URL
      const exportUrl = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      
      return { success: true, data: exportUrl, message: 'Export completed successfully' };
    } catch (error) {
      return { success: false, error: 'Failed to export data' };
    }
  }
}

export const supplierService = new SupplierService();