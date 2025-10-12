/**
 * Auth React Query Hooks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { LoginRequest, RegisterRequest } from '@/lib/api/types';
import { handleApiError } from '@/lib/api/errors';

export const AUTH_QUERY_KEYS = {
  currentUser: ['auth', 'currentUser'] as const,
};

/**
 * Hook to get current authenticated user
 * @param enabled - Whether to enable the query (default: true)
 */
export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.currentUser,
    queryFn: async () => {
      if (!enabled) {
        return null;
      }
      const response = await authService.getCurrentUser();
      const user = response?.user || null;
      
      // Ensure we always return a valid value (not undefined)
      return user;
    },
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

/**
 * Hook to register a new user
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: RegisterRequest) => {
      const response = await authService.register(credentials);
      return response;
    },
    onSuccess: (data) => {
      const user = data.user;
      
      if (!user) {
        console.error('No user in register response:', data);
        return;
      }
      
      queryClient.setQueryData(AUTH_QUERY_KEYS.currentUser, user);
      
      // Store user info in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
    },
    onError: (error) => {
      handleApiError(error, 'Registration failed. Please try again.');
    },
  });
}

/**
 * Hook to login
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await authService.login(credentials);
      return response;
    },
    onSuccess: (data) => {
      const user = data.user;
      
      if (!user) {
        console.error('No user in login response:', data);
        return;
      }
      
      queryClient.setQueryData(AUTH_QUERY_KEYS.currentUser, user);
      
      // Store user info in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
    },
    onError: (error) => {
      handleApiError(error, 'Login failed. Please try again.');
    },
  });
}

/**
 * Hook to logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
    },
    onError: (error) => {
      // Still clear queries even on error
      queryClient.clear();
      handleApiError(error, 'Logout failed');
    },
  });
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { data: user, isSuccess } = useCurrentUser();
  
  // Also check localStorage for initial render
  const hasStoredUser = !!localStorage.getItem('user');
  
  return (isSuccess && !!user) || hasStoredUser;
}

