/**
 * Transactions Service
 * Handles transaction history API calls
 */

import apiClient from '@/lib/api/client';
import {
  TransactionsListRequest,
  TransactionsListResponse,
} from '@/lib/api/types';

export const transactionsService = {
  /**
   * Get list of transactions with pagination, sorting, and filtering
   */
  getTransactions: async (params: TransactionsListRequest = {}): Promise<TransactionsListResponse> => {
    const response = await apiClient.get<never, any>('/transactions', {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        sortBy: params.sortBy || 'timestamp',
        sortOrder: params.sortOrder || 'desc',
        ...(params.status && { status: params.status }),
      },
    });
    
    // The API client interceptor already extracts response.data
    // Handle both wrapped and unwrapped responses
    const data = response.data || response;
    return data as TransactionsListResponse;
  },
};

