/**
 * Dashboard Stats React Query Hook
 */

import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';
import { DashboardStatsRequest } from '@/lib/api/types';

export const DASHBOARD_STATS_QUERY_KEYS = {
  all: ['dashboard', 'stats'] as const,
  byDays: (days: number) => [...DASHBOARD_STATS_QUERY_KEYS.all, days] as const,
};

/**
 * Hook to get dashboard statistics
 * Auto-refreshes every 5 minutes
 */
export function useDashboardStats(params: DashboardStatsRequest = { days: 7 }) {
  return useQuery({
    queryKey: DASHBOARD_STATS_QUERY_KEYS.byDays(params.days || 7),
    queryFn: async () => {
      const response = await analyticsService.getDashboardStats(params);
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    refetchOnWindowFocus: false, // Disable to avoid excessive calls
  });
}

