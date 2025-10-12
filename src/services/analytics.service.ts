import apiClient from '@/lib/api/client';
import {
  DashboardStatsRequest,
  DashboardStatsResponse,
  TimelineRequest,
  TimelineResponse,
} from '@/lib/api/types';

export const analyticsService = {
  /**
   * Get dashboard statistics (total converted, total transactions, most converted pair)
   */
  getDashboardStats: async (params: DashboardStatsRequest = {}): Promise<DashboardStatsResponse> => {
    const response = await apiClient.get<never, any>(
      '/analytics/dashboard/stats',
      {
        params: {
          days: params.days || 7,
        },
      }
    );
    const data = response.data || response;
    return data as DashboardStatsResponse;
  },

  /**
   * Get conversion timeline data for charts
   */
  getTimeline: async (params: TimelineRequest): Promise<TimelineResponse> => {
    const response = await apiClient.get<never, any>('/analytics/timeline', {
      params: {
        startDate: params.startDate,
        endDate: params.endDate,
        interval: params.interval || 'day',
      },
    });
    const data = response.data || response;
    return data as TimelineResponse;
  },
};

