import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User } from '../services/auth.service';
import { fetchCsrfToken, clearCsrfToken } from '../utils/csrf';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;        // For login/register button states
  isInitializing: boolean;   // For initial auth check (full-page spinner)
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);        // For login/register operations
  const [isInitializing, setIsInitializing] = useState(true); // For initial auth check
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing auth on mount
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }
    setIsInitializing(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('[AuthContext] Starting login...');
      setError(null);
      setIsLoading(true);
      const response = await authService.login({ email, password });
      console.log('[AuthContext] Login API success, user:', response.user);
      setUser(response.user);
      console.log('[AuthContext] User state updated, isAuthenticated will be:', !!response.user);

      // Fetch CSRF token after successful login
      try {
        await fetchCsrfToken();
        console.log('[AuthContext] CSRF token fetched successfully');
      } catch (csrfError) {
        console.warn('[AuthContext] Failed to fetch CSRF token:', csrfError);
        // Don't fail the login if CSRF fetch fails
      }

      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Login failed. Please try again.';
      console.error('[AuthContext] Login error:', message, err);
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
      console.log('[AuthContext] Login complete, isLoading now false');
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authService.register({ email, password, firstName, lastName });
      setUser(response.user);

      // Fetch CSRF token after successful registration
      try {
        await fetchCsrfToken();
      } catch (csrfError) {
        console.warn('[AuthContext] Failed to fetch CSRF token:', csrfError);
      }

      return true;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    clearCsrfToken(); // Clear CSRF token on logout
    setUser(null);
  };

  const clearError = () => setError(null);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    // Update localStorage with new user data
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isInitializing,
        login,
        register,
        logout,
        updateUser,
        error,
        clearError
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
