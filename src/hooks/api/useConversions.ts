/**
 * Conversions React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conversionsService } from '@/services/conversions.service';
import { ConversionsListRequest, CreateConversionRequest } from '@/lib/api/types';
import { handleApiError } from '@/lib/api/errors';
import { toast } from 'sonner';
import { DASHBOARD_STATS_QUERY_KEYS } from './useDashboardStats';

export const CONVERSIONS_QUERY_KEYS = {
  all: ['conversions'] as const,
  lists: () => [...CONVERSIONS_QUERY_KEYS.all, 'list'] as const,
  list: (params: ConversionsListRequest) => [...CONVERSIONS_QUERY_KEYS.lists(), params] as const,
  details: () => [...CONVERSIONS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CONVERSIONS_QUERY_KEYS.details(), id] as const,
};

/**
 * Hook to get list of conversions with pagination
 * Auto-refreshes every 2 minutes
 */
export function useConversions(params: ConversionsListRequest = {}) {
  const defaultParams: ConversionsListRequest = {
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...params,
  };

  return useQuery({
    queryKey: CONVERSIONS_QUERY_KEYS.list(defaultParams),
    queryFn: async () => {
      const response = await conversionsService.getConversions(defaultParams);
      return response;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Auto-refresh every 2 minutes
    refetchOnWindowFocus: false, // Disable to avoid excessive calls
  });
}

/**
 * Hook to get a single conversion by ID
 */
export function useConversion(id: string) {
  return useQuery({
    queryKey: CONVERSIONS_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await conversionsService.getConversionById(id);
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new conversion
 * Includes optimistic update and cache invalidation
 */
export function useCreateConversion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateConversionRequest) => {
      const response = await conversionsService.createConversion(data);
      return response;
    },
    onSuccess: (data) => {
      // Show success message
      toast.success('Conversion successful!', {
        description: `Converted ${data.fromAmount} ${data.fromCurrency} to ${data.toAmount.toFixed(2)} ${data.toCurrency}`,
      });

      // Invalidate conversions list to refetch with new data
      queryClient.invalidateQueries({ queryKey: CONVERSIONS_QUERY_KEYS.lists() });
      
      // Invalidate dashboard stats to update totals
      queryClient.invalidateQueries({ queryKey: DASHBOARD_STATS_QUERY_KEYS.all });
    },
    onError: (error) => {
      handleApiError(error, 'Failed to create conversion');
    },
  });
}

