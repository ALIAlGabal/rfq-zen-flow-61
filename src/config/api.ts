// API Configuration and Environment Setup
export const API_CONFIG = {
  // Environment-based API endpoints
  baseURL: {
    development: 'http://localhost:3001/api',
    staging: 'https://staging-api.yourapp.com/api', 
    production: 'https://api.yourapp.com/api'
  },
  
  // API versioning
  version: 'v1',
  
  // Request timeout settings
  timeout: 30000,
  
  // Retry configuration
  retry: {
    attempts: 3,
    delay: 1000,
    backoff: 2
  }
};

// Get current environment
export const getCurrentEnvironment = (): 'development' | 'staging' | 'production' => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  } else if (hostname.includes('staging')) {
    return 'staging';
  } else {
    return 'production';
  }
};

// Get API base URL for current environment
export const getApiBaseURL = (): string => {
  const env = getCurrentEnvironment();
  return `${API_CONFIG.baseURL[env]}/${API_CONFIG.version}`;
};

// API Endpoints
export const API_ENDPOINTS = {
  // Suppliers
  suppliers: '/suppliers',
  supplier: (id: string) => `/suppliers/${id}`,
  
  // Manufacturers  
  manufacturers: '/manufacturers',
  manufacturer: (id: string) => `/manufacturers/${id}`,
  
  // RFQs
  rfqs: '/rfqs',
  rfq: (id: string) => `/rfqs/${id}`,
  rfqLineItems: (rfqId: string) => `/rfqs/${rfqId}/line-items`,
  
  // Bulk operations
  bulkAction: '/bulk-action',
  
  // Statistics
  stats: '/stats',
  
  // Export
  export: '/export',
  
  // Authentication (for future use)
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile'
  }
} as const;

// Service configuration flags
export const SERVICE_CONFIG = {
  // Toggle between mock and real API
  useMockData: process.env.NODE_ENV === 'development' || !navigator.onLine,
  
  // Enable request logging
  enableLogging: process.env.NODE_ENV === 'development',
  
  // Enable caching
  enableCaching: true,
  
  // Cache duration (in milliseconds)
  cacheDuration: 5 * 60 * 1000, // 5 minutes
  
  // Enable optimistic updates
  enableOptimisticUpdates: true,
  
  // Enable offline support
  enableOfflineSupport: true
};