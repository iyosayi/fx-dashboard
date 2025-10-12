// ============================================================================
// Base Response Types
// ============================================================================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: {
      fields?: Record<string, string>;
      [key: string]: unknown;
    };
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// Auth Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface CurrentUserResponse {
  user: User;
}

// ============================================================================
// Currency & Rates Types
// ============================================================================

export interface Currency {
  code: string;
  symbol: string;
  flag: string;
  name: string;
}

export interface CurrenciesResponse {
  currencies: Currency[];
}

export interface ConversionPreviewRequest {
  from: string;
  to: string;
  amount: number;
}

export interface ConversionPreview {
  from: string;
  to: string;
  rate: number;
  amount: number;
  convertedAmount: number;
  timestamp: string;
}

// ============================================================================
// Conversion/Transaction Types
// ============================================================================

export type ConversionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Conversion {
  id: string;
  userId: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  status: ConversionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversionRequest {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

export interface CreateConversionResponse extends Conversion {}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ConversionsListRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  fromCurrency?: string;
  toCurrency?: string;
  status?: ConversionStatus;
}

export interface ConversionsListResponse {
  conversions: Conversion[];
  pagination: Pagination;
}

export type ConversionDetailResponse = Conversion;

// ============================================================================
// Transaction Types (for Transaction History)
// ============================================================================

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  amountSent: number;
  amountReceived: number;
  exchangeRate: number;
  createdAt: string;
  status: TransactionStatus;
}

export interface TransactionPagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  itemsPerPage: number;
}

export interface TransactionsListRequest {
  page?: number;
  limit?: number;
  sortBy?: 'timestamp' | 'rate' | 'amountSent' | 'amountReceived';
  sortOrder?: 'asc' | 'desc';
  status?: TransactionStatus;
}

export interface TransactionsListResponse {
  data: Transaction[];
  pagination: TransactionPagination;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface StatData {
  value: number;
  change: number;
  trendData: number[];
}

export interface MostConvertedStat {
  fromCurrency: string;
  toCurrency: string;
  change: number;
  trendData: number[];
}

/**
 * Multi-currency stat data structure
 * Key is currency code (e.g., 'NGN', 'USD', 'GBP')
 */
export type CurrencyStatData = Record<string, StatData>;

export interface DashboardStats {
  totalConverted: CurrencyStatData; // Changed from StatData to CurrencyStatData
  totalTransactions: StatData;
  mostConverted: MostConvertedStat;
}

export interface DashboardStatsRequest {
  days?: number;
}

export type DashboardStatsResponse = DashboardStats;

export interface TimelineDataPoint {
  timestamp: string;
  conversionCount: number;
  totalAmount: number;
  currency: string;
}

export type TimelineInterval = 'hour' | 'day' | 'week' | 'month';

export interface TimelineRequest {
  startDate: string;
  endDate: string;
  interval?: TimelineInterval;
}

export interface TimelineResponse {
  timeline: TimelineDataPoint[];
  interval: TimelineInterval;
  period: {
    startDate: string;
    endDate: string;
  };
}

// ============================================================================
// Error Codes
// ============================================================================

export enum ApiErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONVERSION_NOT_FOUND = 'CONVERSION_NOT_FOUND',
  RATE_API_ERROR = 'RATE_API_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

