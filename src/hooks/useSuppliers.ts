import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Manufacturer, 
  Supplier, 
  FilterParams, 
  SortParams, 
  PaginationParams,
  BulkAction,
  SupplierStats
} from '@/types/suppliers';
import { getSupplierService } from '@/services/ServiceFactory';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const supplierKeys = {
  all: ['suppliers'] as const,
  manufacturers: () => [...supplierKeys.all, 'manufacturers'] as const,
  manufacturersList: (filters: FilterParams, sort: SortParams, pagination: PaginationParams) => 
    [...supplierKeys.manufacturers(), 'list', filters, sort, pagination] as const,
  manufacturer: (id: string) => [...supplierKeys.manufacturers(), 'detail', id] as const,
  suppliers: () => [...supplierKeys.all, 'suppliers'] as const,
  suppliersList: (filters: FilterParams, sort: SortParams, pagination: PaginationParams) => 
    [...supplierKeys.suppliers(), 'list', filters, sort, pagination] as const,
  supplier: (id: string) => [...supplierKeys.suppliers(), 'detail', id] as const,
  stats: () => [...supplierKeys.all, 'stats'] as const,
};

// Manufacturers hooks
export function useManufacturers(
  filters: FilterParams = {},
  sort: SortParams = { field: 'name', direction: 'asc' },
  pagination: PaginationParams = { page: 1, limit: 10 }
) {
  return useQuery({
    queryKey: supplierKeys.manufacturersList(filters, sort, pagination),
    queryFn: () => getSupplierService().getManufacturers(filters, sort, pagination),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useManufacturer(id: string, enabled = true) {
  return useQuery({
    queryKey: supplierKeys.manufacturer(id),
    queryFn: () => getSupplierService().getManufacturer(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateManufacturer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (manufacturer: Omit<Manufacturer, 'id' | 'createdAt' | 'updatedAt'>) =>
      getSupplierService().createManufacturer(manufacturer),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: supplierKeys.manufacturers() });
        queryClient.invalidateQueries({ queryKey: supplierKeys.stats() });
        toast({
          title: "Success",
          description: response.message || "Manufacturer created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create manufacturer",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create manufacturer",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateManufacturer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Manufacturer> }) =>
      getSupplierService().updateManufacturer(id, updates),
    onSuccess: (response, { id }) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: supplierKeys.manufacturers() });
        queryClient.invalidateQueries({ queryKey: supplierKeys.manufacturer(id) });
        toast({
          title: "Success",
          description: response.message || "Manufacturer updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update manufacturer",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update manufacturer",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteManufacturer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => getSupplierService().deleteManufacturer(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: supplierKeys.manufacturers() });
        queryClient.invalidateQueries({ queryKey: supplierKeys.suppliers() });
        queryClient.invalidateQueries({ queryKey: supplierKeys.stats() });
        toast({
          title: "Success",
          description: response.message || "Manufacturer deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete manufacturer",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete manufacturer",
        variant: "destructive",
      });
    },
  });
}

// Suppliers hooks
export function useSuppliers(
  filters: FilterParams = {},
  sort: SortParams = { field: 'name', direction: 'asc' },
  pagination: PaginationParams = { page: 1, limit: 10 }
) {
  return useQuery({
    queryKey: supplierKeys.suppliersList(filters, sort, pagination),
    queryFn: () => getSupplierService().getSuppliers(filters, sort, pagination),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSupplier(id: string, enabled = true) {
  return useQuery({
    queryKey: supplierKeys.supplier(id),
    queryFn: () => getSupplierService().getSupplier(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) =>
      getSupplierService().createSupplier(supplier),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: supplierKeys.suppliers() });
        queryClient.invalidateQueries({ queryKey: supplierKeys.stats() });
        toast({
          title: "Success",
          description: response.message || "Supplier created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create supplier",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create supplier",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Supplier> }) =>
      getSupplierService().updateSupplier(id, updates),
    onSuccess: (response, { id }) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: supplierKeys.suppliers() });
        queryClient.invalidateQueries({ queryKey: supplierKeys.supplier(id) });
        toast({
          title: "Success",
          description: response.message || "Supplier updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update supplier",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update supplier",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => getSupplierService().deleteSupplier(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: supplierKeys.suppliers() });
        queryClient.invalidateQueries({ queryKey: supplierKeys.manufacturers() });
        queryClient.invalidateQueries({ queryKey: supplierKeys.stats() });
        toast({
          title: "Success",
          description: response.message || "Supplier deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete supplier",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete supplier",
        variant: "destructive",
      });
    },
  });
}

// Common hooks
export function useBulkAction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (action: BulkAction) => getSupplierService().bulkAction(action),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: supplierKeys.all });
        toast({
          title: "Success",
          description: response.message || "Bulk action completed successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to perform bulk action",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to perform bulk action",
        variant: "destructive",
      });
    },
  });
}

export function useSupplierStats() {
  return useQuery({
    queryKey: supplierKeys.stats(),
    queryFn: () => getSupplierService().getStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useExportData() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (type: 'manufacturers' | 'suppliers' | 'all') =>
      getSupplierService().exportData(type),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Create and trigger download
        const link = document.createElement('a');
        link.href = response.data;
        link.download = `suppliers-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Success",
          description: response.message || "Export completed successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to export data",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    },
  });
}