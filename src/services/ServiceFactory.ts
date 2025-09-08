import { SERVICE_CONFIG } from '@/config/api';
import { ServiceMode, ServiceFactory } from '@/types/api';
import { supplierService } from './supplierService'; // Mock service
import { ApiSupplierService } from './api/ApiSupplierService'; // API service
import { MockRFQService } from './mock/MockRFQService'; // Mock RFQ service
import { ApiRFQService } from './api/ApiRFQService'; // API RFQ service

// Service Factory for switching between Mock and API implementations
class ServiceFactoryImpl implements ServiceFactory {
  private apiSupplierService: ApiSupplierService | null = null;
  private mockRFQService: MockRFQService | null = null;
  private apiRFQService: ApiRFQService | null = null;

  // Get current service mode
  private getMode(): ServiceMode {
    return SERVICE_CONFIG.useMockData ? 'mock' : 'api';
  }

  // Create supplier service based on mode
  createSupplierService(mode?: ServiceMode) {
    const serviceMode = mode || this.getMode();
    
    if (serviceMode === 'mock') {
      return supplierService; // Existing mock service
    } else {
      // Create API service instance if needed
      if (!this.apiSupplierService) {
        this.apiSupplierService = new ApiSupplierService();
      }
      return this.apiSupplierService;
    }
  }

  // Create manufacturer service (same as supplier for now)
  createManufacturerService(mode?: ServiceMode) {
    return this.createSupplierService(mode);
  }

  // Create RFQ service
  createRFQService(mode?: ServiceMode) {
    const serviceMode = mode || this.getMode();
    
    if (serviceMode === 'mock') {
      // Create mock RFQ service instance if needed
      if (!this.mockRFQService) {
        this.mockRFQService = new MockRFQService();
      }
      return this.mockRFQService;
    } else {
      // Create API RFQ service instance if needed
      if (!this.apiRFQService) {
        this.apiRFQService = new ApiRFQService();
      }
      return this.apiRFQService;
    }
  }

  // Switch service mode globally
  setServiceMode(mode: ServiceMode): void {
    SERVICE_CONFIG.useMockData = mode === 'mock';
  }

  // Get current service mode
  getCurrentMode(): ServiceMode {
    return this.getMode();
  }
}

// Export singleton instance
export const serviceFactory = new ServiceFactoryImpl();

// Convenience exports for current services
export const getSupplierService = () => serviceFactory.createSupplierService();
export const getManufacturerService = () => serviceFactory.createManufacturerService();
export const getRFQService = () => serviceFactory.createRFQService();