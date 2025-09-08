// Enhanced API Type Definitions

// Base API types
export interface ApiRequest<T = any> {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: T;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
  requestId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  requestId?: string;
}

// Pagination types for API
export interface ApiPaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Filtering types for API
export interface ApiFilterParams {
  search?: string;
  status?: string;
  industry?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: any; // Allow additional filters
}

// Authentication types (for future use)
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

// Request/Response transformation types
export interface RequestTransformer<TInput, TOutput> {
  (input: TInput): TOutput;
}

export interface ResponseTransformer<TInput, TOutput> {
  (input: TInput): TOutput;
}

// API service interface
export interface IApiService {
  get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>>;
  post<T, D = any>(url: string, data?: D): Promise<ApiResponse<T>>;
  put<T, D = any>(url: string, data?: D): Promise<ApiResponse<T>>;
  patch<T, D = any>(url: string, data?: D): Promise<ApiResponse<T>>;
  delete<T>(url: string): Promise<ApiResponse<T>>;
}

// Cache types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheManager {
  get<T>(key: string): CacheEntry<T> | null;
  set<T>(key: string, data: T, ttl?: number): void;
  delete(key: string): void;
  clear(): void;
  has(key: string): boolean;
}

// Request queue types (for offline support)
export interface QueuedRequest {
  id: string;
  request: ApiRequest;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export interface RequestQueue {
  add(request: ApiRequest, options?: { maxRetries?: number }): string;
  remove(id: string): void;
  process(): Promise<void>;
  clear(): void;
  getAll(): QueuedRequest[];
}

// Service factory types
export type ServiceMode = 'mock' | 'api';

export interface ServiceFactory {
  createSupplierService(mode?: ServiceMode): any;
  createManufacturerService(mode?: ServiceMode): any;
  createRFQService(mode?: ServiceMode): any;
}