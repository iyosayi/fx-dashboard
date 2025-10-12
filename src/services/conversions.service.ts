/**
 * Conversions Service
 * Handles conversion/transaction API calls
 */

import apiClient from '@/lib/api/client';
import {
  CreateConversionRequest,
  CreateConversionResponse,
  ConversionsListRequest,
  ConversionsListResponse,
  ConversionDetailResponse,
} from '@/lib/api/types';

export const conversionsService = {
  /**
   * Get list of conversions with pagination and filters
   */
  getConversions: async (params: ConversionsListRequest = {}): Promise<ConversionsListResponse> => {
    const response = await apiClient.get<never, any>('/conversions', {
      params: {
        page: params.page || 1,
        limit: params.limit || 20,
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc',
        ...params,
      },
    });
    const data = response.data || response;
    return data as ConversionsListResponse;
  },

  /**
   * Get a single conversion by ID
   */
  getConversionById: async (id: string): Promise<ConversionDetailResponse> => {
    const response = await apiClient.get<never, any>(`/conversions/${id}`);
    const data = response.data || response;
    return data as ConversionDetailResponse;
  },

  /**
   * Create a new conversion
   */
  createConversion: async (data: CreateConversionRequest): Promise<CreateConversionResponse> => {
    const response = await apiClient.post<never, any>('/conversions', data);
    const responseData = response.data || response;
    return responseData as CreateConversionResponse;
  },
};

