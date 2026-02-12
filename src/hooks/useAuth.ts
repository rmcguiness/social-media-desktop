'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, type AuthResponse } from '@/services/auth.service';
import { setAccessTokenCookie, setRefreshToken, clearRefreshToken, getRefreshToken, clearAuthToken } from '@/app/actions/auth';

interface AuthState {
  accessToken: string | null;
  user: AuthResponse['user'] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (emailOrUsername: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  setAccessToken: (token: string) => void;
  setUser: (user: AuthResponse['user']) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
  
  login: async (emailOrUsername: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authService.login({ emailOrUsername, password });
      
      // Store access token in memory (Zustand state)
      set({
        accessToken: response.accessToken,
        user: response.user,
        isAuthenticated: true,
      });
      
      // Store tokens in httpOnly cookies (for server components)
      await setAccessTokenCookie(response.accessToken);
      await setRefreshToken(response.refreshToken);
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: async () => {
    const { accessToken } = get();
    
    // Get refresh token from cookie
    const refreshToken = await getRefreshToken();
    
    // Clear state first (optimistic)
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
    
    // Clear both cookies
    await clearAuthToken();
    await clearRefreshToken();
    
    // Revoke refresh token on server (best effort)
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  },
  
  refreshAccessToken: async () => {
    const refreshToken = await getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await authService.refresh(refreshToken);
      
      // Update access token in memory
      set({ accessToken: response.accessToken });
      
      // Update both cookies
      await setAccessTokenCookie(response.accessToken);
      await setRefreshToken(response.refreshToken);
    } catch (error) {
      // Refresh failed - clear auth state
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
      });
      await clearAuthToken();
      await clearRefreshToken();
      throw error;
    }
  },
  
  setAccessToken: (token: string) => {
    set({ accessToken: token, isAuthenticated: true });
  },
  
  setUser: (user: AuthResponse['user']) => {
    set({ user });
  },
}),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper hook to get the current access token
export const useAccessToken = () => {
  return useAuth((state) => state.accessToken);
};

// Helper hook to check if user is authenticated
export const useIsAuthenticated = () => {
  return useAuth((state) => state.isAuthenticated);
};
