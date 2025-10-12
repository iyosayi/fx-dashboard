/**
 * API Client with Axios
 * Features:
 * - Automatic token refresh
 * - Request/response interceptors
 * - Error handling
 * - Request retry logic
 * - Logging in development
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from '../env';
import { ApiError, shouldRetry, getRetryDelay } from './errors';
import { ApiErrorResponse, ApiErrorCode, RefreshTokenRequest } from './types';

// ============================================================================
// Token Management with httpOnly Cookies
// ============================================================================

/**
 * Note: For httpOnly cookies, tokens are managed by the browser automatically.
 * We'll use axios withCredentials to send cookies with every request.
 * The backend will set the tokens as httpOnly cookies on login.
 */

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

// ============================================================================
// Axios Instance Configuration
// ============================================================================

const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with every request (for httpOnly cookies)
});

// ============================================================================
// Request Interceptor
// ============================================================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log request in development
    if (env.enableApiLogging) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    if (env.enableApiLogging) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// Response Interceptor
// ============================================================================

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (env.enableApiLogging) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    // Return only the data portion for successful responses
    return response.data;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Log error in development
    if (env.enableApiLogging) {
      console.error(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Handle network errors
    if (!error.response) {
      const networkError = new ApiError(
        ApiErrorCode.NETWORK_ERROR,
        'Network error. Please check your connection.',
        { originalError: error.message },
        0
      );
      return Promise.reject(networkError);
    }

    const statusCode = error.response.status;
    const errorResponse = error.response.data;

    // Handle token expiration - attempt to refresh
    if (statusCode === 401 && errorResponse?.error?.code === ApiErrorCode.TOKEN_EXPIRED && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          // Attempt to refresh token
          // Since we're using httpOnly cookies, the refresh endpoint will use the refresh token from cookies
          await axios.post(
            `${env.apiUrl}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          isRefreshing = false;
          onTokenRefreshed('refreshed');

          // Retry the original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];

          // Refresh failed - redirect to login
          if (env.enableApiLogging) {
            console.error('🔄 Token refresh failed, redirecting to login');
          }

          // Clear any local storage and redirect
          localStorage.clear();
          window.location.href = '/';

          return Promise.reject(
            new ApiError(
              ApiErrorCode.UNAUTHORIZED,
              'Session expired. Please login again.',
              undefined,
              401
            )
          );
        }
      } else {
        // Wait for the refresh to complete
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(apiClient(originalRequest));
          });
        });
      }
    }

    // Handle unauthorized - only redirect if not on login page
    if (statusCode === 401) {
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/') || window.location.pathname === '/dashboard') {
        localStorage.clear();
        window.location.href = '/';
      }
      
      return Promise.reject(
        ApiError.fromResponse(errorResponse || {
          success: false,
          error: { code: ApiErrorCode.UNAUTHORIZED, message: 'Unauthorized' }
        }, statusCode)
      );
    }

    // Convert to ApiError
    const apiError = errorResponse
      ? ApiError.fromResponse(errorResponse, statusCode)
      : new ApiError(
          ApiErrorCode.INTERNAL_SERVER_ERROR,
          error.message || 'An error occurred',
          undefined,
          statusCode
        );

    return Promise.reject(apiError);
  }
);

// ============================================================================
// Retry Logic Wrapper
// ============================================================================

export async function requestWithRetry<T>(
  requestFn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: ApiError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error instanceof ApiError ? error : new ApiError(
        ApiErrorCode.INTERNAL_SERVER_ERROR,
        'Unknown error',
        { originalError: error }
      );

      // Don't retry if we shouldn't
      if (!shouldRetry(lastError) || attempt === maxRetries) {
        throw lastError;
      }

      // Wait before retrying with exponential backoff
      const delay = getRetryDelay(attempt);
      if (env.enableApiLogging) {
        console.log(`🔄 Retrying request (attempt ${attempt + 1}/${maxRetries}) after ${delay}ms`);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

export default apiClient;

