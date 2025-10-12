/**
 * Transactions React Query Hook
 */

import { useQuery } from '@tanstack/react-query';
import { transactionsService } from '@/services/transactions.service';
import { TransactionsListRequest } from '@/lib/api/types';
import { formatDistanceToNow } from 'date-fns';

export const TRANSACTIONS_QUERY_KEYS = {
  all: ['transactions'] as const,
  lists: () => [...TRANSACTIONS_QUERY_KEYS.all, 'list'] as const,
  list: (params: TransactionsListRequest) => [...TRANSACTIONS_QUERY_KEYS.lists(), params] as const,
};

/**
 * Formats ISO timestamp to relative time (e.g., "2 hours ago")
 */
function formatRelativeTime(isoTimestamp: string): string {
  try {
    return formatDistanceToNow(new Date(isoTimestamp), { addSuffix: true });
  } catch {
    return 'Unknown';
  }
}

/**
 * Formats ISO timestamp to human-readable date (e.g., "Oct 12, 2025 2:30 PM")
 */
function formatFullDate(isoTimestamp: string): string {
  try {
    const date = new Date(isoTimestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Hook to get list of transactions with pagination, sorting, and filtering
 * Transforms API response to match component's expected format
 */
export function useTransactions(params: TransactionsListRequest = {}) {
  const defaultParams: TransactionsListRequest = {
    page: 1,
    limit: 10,
    sortBy: 'timestamp',
    sortOrder: 'desc',
    ...params,
  };

  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEYS.list(defaultParams),
    queryFn: async () => {
      const response = await transactionsService.getTransactions(defaultParams);
      
      // Transform API response to match component format
      const transformedData = response.data.map((transaction, index) => ({
        id: index + 1 + (response.pagination.currentPage - 1) * response.pagination.itemsPerPage, // Generate numeric ID for display
        from: transaction.fromCurrency,
        to: transaction.toCurrency,
        amountSent: transaction.amountSent,
        amountReceived: transaction.amountReceived,
        rate: transaction.exchangeRate,
        timestamp: formatRelativeTime(transaction.createdAt),
        fullDate: formatFullDate(transaction.createdAt),
        status: transaction.status,
        _originalId: transaction.id, // Keep original ID for actions
      }));

      return {
        transactions: transformedData,
        pagination: response.pagination,
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Auto-refresh every 2 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
}

