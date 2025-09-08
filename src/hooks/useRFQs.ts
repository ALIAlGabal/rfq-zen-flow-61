import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  RFQRecord, 
  LineItem 
} from '@/types/rfq';
import { 
  FilterParams, 
  SortParams, 
  PaginationParams 
} from '@/types/suppliers';
import { getRFQService } from '@/services/ServiceFactory';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const rfqKeys = {
  all: ['rfqs'] as const,
  lists: () => [...rfqKeys.all, 'list'] as const,
  list: (filters: FilterParams, sort: SortParams, pagination: PaginationParams) => 
    [...rfqKeys.lists(), filters, sort, pagination] as const,
  details: () => [...rfqKeys.all, 'detail'] as const,
  detail: (id: string) => [...rfqKeys.details(), id] as const,
  stats: () => [...rfqKeys.all, 'stats'] as const,
};

// RFQ hooks
export function useRFQs(
  filters: FilterParams = {},
  sort: SortParams = { field: 'publishDate', direction: 'desc' },
  pagination: PaginationParams = { page: 1, limit: 10 }
) {
  const rfqService = getRFQService();
  
  return useQuery({
    queryKey: rfqKeys.list(filters, sort, pagination),
    queryFn: () => rfqService?.getRFQs(filters, sort, pagination),
    enabled: !!rfqService,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRFQ(id: string, enabled = true) {
  const rfqService = getRFQService();
  
  return useQuery({
    queryKey: rfqKeys.detail(id),
    queryFn: () => rfqService?.getRFQ(id),
    enabled: enabled && !!id && !!rfqService,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateRFQ() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const rfqService = getRFQService();

  return useMutation({
    mutationFn: (rfq: Omit<RFQRecord, 'id' | 'lastUpdated'>) =>
      rfqService?.createRFQ(rfq),
    onSuccess: (response) => {
      if (response?.success) {
        queryClient.invalidateQueries({ queryKey: rfqKeys.lists() });
        queryClient.invalidateQueries({ queryKey: rfqKeys.stats() });
        toast({
          title: "Success",
          description: response.message || "RFQ created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response?.error || "Failed to create RFQ",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create RFQ",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateRFQ() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const rfqService = getRFQService();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<RFQRecord> }) =>
      rfqService?.updateRFQ(id, updates),
    onSuccess: (response, { id }) => {
      if (response?.success) {
        queryClient.invalidateQueries({ queryKey: rfqKeys.lists() });
        queryClient.invalidateQueries({ queryKey: rfqKeys.detail(id) });
        toast({
          title: "Success",
          description: response.message || "RFQ updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response?.error || "Failed to update RFQ",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update RFQ",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteRFQ() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const rfqService = getRFQService();

  return useMutation({
    mutationFn: (id: string) => rfqService?.deleteRFQ(id),
    onSuccess: (response) => {
      if (response?.success) {
        queryClient.invalidateQueries({ queryKey: rfqKeys.lists() });
        queryClient.invalidateQueries({ queryKey: rfqKeys.stats() });
        toast({
          title: "Success",
          description: response.message || "RFQ deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response?.error || "Failed to delete RFQ",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete RFQ",
        variant: "destructive",
      });
    },
  });
}

// Line item hooks
export function useUpdateLineItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const rfqService = getRFQService();

  return useMutation({
    mutationFn: ({ rfqId, lineItemId, updates }: { 
      rfqId: string; 
      lineItemId: string; 
      updates: Partial<LineItem> 
    }) => rfqService?.updateLineItem(rfqId, lineItemId, updates),
    onSuccess: (response, { rfqId }) => {
      if (response?.success) {
        queryClient.invalidateQueries({ queryKey: rfqKeys.lists() });
        queryClient.invalidateQueries({ queryKey: rfqKeys.detail(rfqId) });
        toast({
          title: "Success",
          description: response.message || "Line item updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response?.error || "Failed to update line item",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update line item",
        variant: "destructive",
      });
    },
  });
}

// Bulk operations
export function useBulkDeleteRFQs() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const rfqService = getRFQService();

  return useMutation({
    mutationFn: (ids: string[]) => rfqService?.bulkDeleteRFQs(ids),
    onSuccess: (response) => {
      if (response?.success) {
        queryClient.invalidateQueries({ queryKey: rfqKeys.all });
        toast({
          title: "Success",
          description: response.message || "RFQs deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response?.error || "Failed to delete RFQs",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete RFQs",
        variant: "destructive",
      });
    },
  });
}

export function useBulkUpdateRFQs() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const rfqService = getRFQService();

  return useMutation({
    mutationFn: (updates: Array<{ id: string; data: Partial<RFQRecord> }>) =>
      rfqService?.bulkUpdateRFQs(updates),
    onSuccess: (response) => {
      if (response?.success) {
        queryClient.invalidateQueries({ queryKey: rfqKeys.all });
        toast({
          title: "Success",
          description: response.message || "RFQs updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response?.error || "Failed to update RFQs",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update RFQs",
        variant: "destructive",
      });
    },
  });
}

// Search hook
export function useSearchRFQs(query: string, filters: FilterParams = {}) {
  const rfqService = getRFQService();
  
  return useQuery({
    queryKey: [...rfqKeys.all, 'search', query, filters],
    queryFn: () => rfqService?.searchRFQs(query, filters),
    enabled: !!query && !!rfqService,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Statistics hook
export function useRFQStats() {
  const rfqService = getRFQService();
  
  return useQuery({
    queryKey: rfqKeys.stats(),
    queryFn: () => rfqService?.getStats(),
    enabled: !!rfqService,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Export hook
export function useExportRFQs() {
  const { toast } = useToast();
  const rfqService = getRFQService();

  return useMutation({
    mutationFn: ({ format, filters }: { 
      format?: 'csv' | 'excel' | 'json'; 
      filters?: FilterParams 
    }) => rfqService?.exportRFQs(format, filters),
    onSuccess: (response) => {
      if (response?.success && response.data) {
        // Create and trigger download
        const link = document.createElement('a');
        link.href = response.data;
        link.download = `rfqs-export-${new Date().toISOString().split('T')[0]}.json`;
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
          description: response?.error || "Failed to export RFQs",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to export RFQs",
        variant: "destructive",
      });
    },
  });
}