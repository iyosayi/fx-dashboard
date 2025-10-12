import apiClient from '@/lib/api/client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  CurrentUserResponse,
  RefreshTokenResponse,
  RefreshTokenRequest,
} from '@/lib/api/types';

export const authService = {
  /**
   * Register a new user
   */
  register: async (credentials: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<never, any>('/auth/register', credentials);
    const data = response.data || response;
    return data as RegisterResponse;
  },

  /**
   * Login with email and password
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<never, any>('/auth/login', credentials);
    const data = response.data || response;
    return data as LoginResponse;
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Always clear local storage even if request fails
      localStorage.clear();
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    const response = await apiClient.get<never, any>('/auth/me');
    const data = response.data || response;
    
    // Ensure response has the expected structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response from /auth/me');
    }
    return data as CurrentUserResponse;
  },

  /**
   * Refresh access token
   * Note: With httpOnly cookies, this will use the refresh token from cookies automatically
   */
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<never, any>('/auth/refresh', {});
    const data = response.data || response;
    return data as RefreshTokenResponse;
  },
};

