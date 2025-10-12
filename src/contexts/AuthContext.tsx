import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/api/types';
import { useLogin, useRegister, useLogout, useCurrentUser } from '@/hooks/api/useAuth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<unknown>;
  register: (email: string, password: string) => Promise<unknown>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredUser(): User | null {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
      return JSON.parse(storedUser);
    }
  } catch (error) {
    console.error('Failed to parse stored user:', error);
  }
  // Always clean up invalid data
  localStorage.removeItem('user');
  return null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [shouldFetchUser, setShouldFetchUser] = useState(false);

  // Check if we should fetch user on mount
  useEffect(() => {
    setShouldFetchUser(!!getStoredUser());
  }, []);

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  
  // Only fetch current user if enabled
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser(shouldFetchUser);

  // Sync user from React Query to local state
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);

  const register = async (email: string, password: string) => {
    const result = await registerMutation.mutateAsync({ email, password });
    
    // Extract user from response
    const registeredUser = result.user;
    
    if (registeredUser) {
      setUser(registeredUser);
      setShouldFetchUser(true);
    }
    
    return result;
  };

  const login = async (email: string, password: string) => {
    const result = await loginMutation.mutateAsync({ email, password });
    
    // Extract user from response
    const loggedInUser = result.user;
    
    if (loggedInUser) {
      setUser(loggedInUser);
      setShouldFetchUser(true);
    }
    
    return result;
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setUser(null);
    setShouldFetchUser(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login,
        register, 
        logout, 
        isAuthenticated: !!user,
        isLoading: isLoadingUser || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
