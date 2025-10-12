/**
 * API Error Handling Utilities
 */

import { ApiErrorResponse, ApiErrorCode } from './types';
import { toast } from 'sonner';

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(errorResponse: ApiErrorResponse, statusCode?: number): ApiError {
    return new ApiError(
      errorResponse.error.code,
      errorResponse.error.message,
      errorResponse.error.details,
      statusCode
    );
  }

  isAuthError(): boolean {
    return [
      ApiErrorCode.UNAUTHORIZED,
      ApiErrorCode.TOKEN_EXPIRED,
      ApiErrorCode.INVALID_CREDENTIALS,
    ].includes(this.code as ApiErrorCode);
  }

  isValidationError(): boolean {
    return this.code === ApiErrorCode.VALIDATION_ERROR;
  }

  isNetworkError(): boolean {
    return this.code === ApiErrorCode.NETWORK_ERROR;
  }

  isRateLimitError(): boolean {
    return this.code === ApiErrorCode.RATE_LIMIT_EXCEEDED;
  }

  getFieldErrors(): Record<string, string> {
    if (this.details && typeof this.details === 'object' && 'fields' in this.details) {
      return (this.details.fields as Record<string, string>) || {};
    }
    return {};
  }
}

/**
 * Handle API error and show appropriate toast notification
 */
export function handleApiError(error: unknown, fallbackMessage = 'An error occurred'): ApiError {
  if (error instanceof ApiError) {
    // Don't show toast for auth errors (handled by interceptor)
    if (!error.isAuthError()) {
      if (error.isValidationError()) {
        const fieldErrors = error.getFieldErrors();
        const firstError = Object.values(fieldErrors)[0];
        toast.error(firstError || error.message);
      } else if (error.isRateLimitError()) {
        toast.error('Too many requests. Please wait a moment and try again.');
      } else {
        toast.error(error.message);
      }
    }
    return error;
  }

  // Unknown error
  console.error('Unknown error:', error);
  toast.error(fallbackMessage);
  
  return new ApiError(
    ApiErrorCode.INTERNAL_SERVER_ERROR,
    fallbackMessage,
    { originalError: error }
  );
}

/**
 * Check if error should trigger retry
 */
export function shouldRetry(error: ApiError): boolean {
  // Don't retry auth errors, validation errors, or rate limit errors
  if (error.isAuthError() || error.isValidationError() || error.isRateLimitError()) {
    return false;
  }

  // Don't retry 4xx errors (except 408 Request Timeout and 429 Too Many Requests)
  if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
    return error.statusCode === 408;
  }

  // Retry network errors and 5xx errors
  return error.isNetworkError() || (error.statusCode ? error.statusCode >= 500 : false);
}

/**
 * Get retry delay with exponential backoff
 */
export function getRetryDelay(attemptNumber: number, baseDelay = 1000): number {
  return Math.min(baseDelay * Math.pow(2, attemptNumber - 1), 10000); // Max 10 seconds
}

