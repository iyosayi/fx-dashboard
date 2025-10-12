/**
 * Analytics React Query Hooks
 */

import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';
import { TimelineRequest } from '@/lib/api/types';

export const ANALYTICS_QUERY_KEYS = {
  all: ['analytics'] as const,
  timeline: (params: TimelineRequest) => [...ANALYTICS_QUERY_KEYS.all, 'timeline', params] as const,
};

/**
 * Hook to get conversion timeline data for charts
 * Accepts date range and interval
 */
export function useConversionTimeline(params: TimelineRequest) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.timeline(params),
    queryFn: async () => {
      const response = await analyticsService.getTimeline(params);
      return response;
    },
    enabled: !!params.startDate && !!params.endDate,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to get last N days of timeline data
 * Convenience wrapper for useConversionTimeline
 */
export function useConversionTimelineDays(days: number = 7) {
  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEYS.all, 'timelineDays', days],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const params: TimelineRequest = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        interval: 'day',
      };

      const response = await analyticsService.getTimeline(params);
      return response;
    },
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false, 
  });
}

