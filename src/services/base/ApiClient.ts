import { API_CONFIG, getApiBaseURL, SERVICE_CONFIG } from '@/config/api';
import { ApiRequest, ApiResponse, ApiError, IApiService } from '@/types/api';

// HTTP Client with retry logic and error handling
export class ApiClient implements IApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = getApiBaseURL();
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // Set authentication token
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove authentication token
  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  // Add request interceptor
  private async requestInterceptor(request: ApiRequest): Promise<ApiRequest> {
    // Log request in development
    if (SERVICE_CONFIG.enableLogging) {
      console.log('API Request:', request);
    }

    // Add timestamp
    request.headers = {
      ...this.defaultHeaders,
      ...request.headers,
      'X-Request-Time': new Date().toISOString()
    };

    return request;
  }

  // Add response interceptor
  private async responseInterceptor<T>(response: Response, originalRequest: ApiRequest): Promise<ApiResponse<T>> {
    const requestId = response.headers.get('X-Request-ID') || '';
    
    try {
      const data = await response.json();
      
      const apiResponse: ApiResponse<T> = {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: !response.ok ? data.message || 'Request failed' : undefined,
        message: data.message,
        timestamp: new Date().toISOString(),
        requestId
      };

      // Log response in development
      if (SERVICE_CONFIG.enableLogging) {
        console.log('API Response:', apiResponse);
      }

      return apiResponse;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse response',
        timestamp: new Date().toISOString(),
        requestId
      };
    }
  }

  // Retry logic with exponential backoff
  private async retryRequest<T>(request: ApiRequest, attempt: number = 1): Promise<ApiResponse<T>> {
    try {
      const processedRequest = await this.requestInterceptor(request);
      
      const url = request.url.startsWith('http') ? request.url : `${this.baseURL}${request.url}`;
      const searchParams = new URLSearchParams();
      
      if (request.params) {
        Object.keys(request.params).forEach(key => {
          if (request.params![key] !== undefined) {
            searchParams.append(key, String(request.params![key]));
          }
        });
      }

      const finalUrl = searchParams.toString() ? `${url}?${searchParams}` : url;

      const fetchOptions: RequestInit = {
        method: processedRequest.method,
        headers: processedRequest.headers,
        signal: AbortSignal.timeout(API_CONFIG.timeout)
      };

      if (processedRequest.data && processedRequest.method !== 'GET') {
        fetchOptions.body = JSON.stringify(processedRequest.data);
      }

      const response = await fetch(finalUrl, fetchOptions);
      return await this.responseInterceptor<T>(response, processedRequest);

    } catch (error) {
      // Check if we should retry
      if (attempt < API_CONFIG.retry.attempts && this.shouldRetry(error)) {
        const delay = API_CONFIG.retry.delay * Math.pow(API_CONFIG.retry.backoff, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest<T>(request, attempt + 1);
      }

      // Return error response
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Request failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Check if error is retryable
  private shouldRetry(error: any): boolean {
    // Network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return true;
    }
    
    // Timeout errors
    if (error.name === 'AbortError') {
      return true;
    }
    
    // 5xx server errors
    if (error.status >= 500 && error.status < 600) {
      return true;
    }
    
    return false;
  }

  // HTTP methods
  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.retryRequest<T>({
      method: 'GET',
      url,
      params
    });
  }

  async post<T, D = any>(url: string, data?: D): Promise<ApiResponse<T>> {
    return this.retryRequest<T>({
      method: 'POST',
      url,
      data
    });
  }

  async put<T, D = any>(url: string, data?: D): Promise<ApiResponse<T>> {
    return this.retryRequest<T>({
      method: 'PUT',
      url,
      data
    });
  }

  async patch<T, D = any>(url: string, data?: D): Promise<ApiResponse<T>> {
    return this.retryRequest<T>({
      method: 'PATCH',
      url,
      data
    });
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.retryRequest<T>({
      method: 'DELETE',
      url
    });
  }
}

export const apiClient = new ApiClient();