/**
 * Rates React Query Hooks
 */

import { useQuery } from '@tanstack/react-query';
import { ratesService } from '@/services/rates.service';
import { ConversionPreviewRequest } from '@/lib/api/types';

export const RATES_QUERY_KEYS = {
  all: ['rates'] as const,
  currencies: () => [...RATES_QUERY_KEYS.all, 'currencies'] as const,
  preview: (params: ConversionPreviewRequest) => [...RATES_QUERY_KEYS.all, 'preview', params] as const,
};

/**
 * Hook to get list of available currencies
 * Cached for 30 minutes as currencies rarely change
 */
export function useCurrencies() {
  return useQuery({
    queryKey: RATES_QUERY_KEYS.currencies(),
    queryFn: async () => {
      const response = await ratesService.getCurrencies();
      return response.currencies;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
  });
}

/**
 * Hook to preview a conversion (get rate and converted amount)
 * Auto-refreshes every 1 minute for real-time rates
 */
export function useConversionPreview(
  params: ConversionPreviewRequest,
  options: { enabled?: boolean } = {}
) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: RATES_QUERY_KEYS.preview(params),
    queryFn: async () => {
      const response = await ratesService.previewConversion(params);
      return response;
    },
    enabled: enabled && !!params.from && !!params.to && params.amount > 0,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Auto-refresh every 1 minute
    refetchOnWindowFocus: true,
  });
}

