export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isPrimary: boolean;
}

export interface Manufacturer {
  id: string;
  name: string;
  description?: string;
  industry: string;
  website?: string;
  address: Address;
  contacts: Contact[];
  linkedSupplierIds: string[];
  capabilities: string[];
  certifications: string[];
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  lastContactDate?: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  description?: string;
  type: 'distributor' | 'reseller' | 'wholesaler' | 'broker';
  website?: string;
  address: Address;
  contacts: Contact[];
  linkedManufacturerIds: string[];
  specializations: string[];
  paymentTerms?: string;
  deliveryTime?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  lastContactDate?: string;
  notes?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  search?: string;
  status?: 'active' | 'inactive' | 'pending' | 'all';
  industry?: string;
  type?: string;
}

export interface SortParams {
  field: 'name' | 'createdAt' | 'updatedAt' | 'lastContactDate' | 'publishDate' | 'bidDate' | 'lastUpdated';
  direction: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface BulkAction {
  action: 'delete' | 'activate' | 'deactivate' | 'export';
  ids: string[];
}

export interface SupplierStats {
  totalManufacturers: number;
  totalSuppliers: number;
  activeManufacturers: number;
  activeSuppliers: number;
  recentlyAdded: number;
  pendingApproval: number;
}