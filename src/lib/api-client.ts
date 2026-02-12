import { API_BASE_URL } from '@/config/api';

type FetchOptions = RequestInit & {
  skipAuth?: boolean;
  token?: string;
  revalidate?: number | false;
  tags?: string[];
};

let refreshPromise: Promise<string> | null = null;

/**
 * Enhanced fetch with automatic token refresh on 401
 */
export async function apiFetch(url: string, options: FetchOptions = {}) {
  const { skipAuth = false, token: customToken, ...fetchOptions } = options;
  
  // Get access token from Zustand store (imported dynamically to avoid circular deps)
  const getAccessToken = () => {
    if (typeof window === 'undefined') return null;
    const { useAuth } = require('@/hooks/useAuth');
    return useAuth.getState().accessToken;
  };
  
  // Helper to refresh token
  const refreshAccessToken = async (): Promise<string> => {
    if (refreshPromise) {
      return refreshPromise;
    }
    
    refreshPromise = (async () => {
      try {
        const { useAuth } = require('@/hooks/useAuth');
        await useAuth.getState().refreshAccessToken();
        return useAuth.getState().accessToken || '';
      } finally {
        refreshPromise = null;
      }
    })();
    
    return refreshPromise;
  };
  
  // Build headers
  const headers = new Headers(fetchOptions.headers);
  if (!skipAuth) {
    const token = customToken || getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  
  // Make initial request
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  let response = await fetch(fullUrl, {
    ...fetchOptions,
    headers,
  });
  
  // If 401 and not already refreshing, try to refresh token
  if (response.status === 401 && !skipAuth) {
    try {
      const newToken = await refreshAccessToken();
      
      // Retry request with new token
      headers.set('Authorization', `Bearer ${newToken}`);
      response = await fetch(fullUrl, {
        ...fetchOptions,
        headers,
      });
    } catch (error) {
      // Refresh failed - redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw error;
    }
  }
  
  return response;
}

/**
 * Helper for GET requests
 */
export async function apiGet<T>(url: string, options?: FetchOptions): Promise<T> {
  const response = await apiFetch(url, { ...options, method: 'GET' });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
}

/**
 * Helper for POST requests
 */
export async function apiPost<T>(url: string, data?: unknown, options?: FetchOptions): Promise<T> {
  const headers: Record<string, string> = {
    ...options?.headers,
  };
  
  // Only set Content-Type if we have data to send
  if (data !== undefined && data !== null) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await apiFetch(url, {
    ...options,
    method: 'POST',
    headers,
    body: data !== undefined && data !== null ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
}

/**
 * Helper for PUT requests
 */
export async function apiPut<T>(url: string, data?: unknown, options?: FetchOptions): Promise<T> {
  const headers: Record<string, string> = {
    ...options?.headers,
  };
  
  // Only set Content-Type if we have data to send
  if (data !== undefined && data !== null) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await apiFetch(url, {
    ...options,
    method: 'PUT',
    headers,
    body: data !== undefined && data !== null ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
}

/**
 * Helper for DELETE requests
 */
export async function apiDelete<T>(url: string, options?: FetchOptions): Promise<T> {
  const response = await apiFetch(url, { ...options, method: 'DELETE' });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
}

/**
 * API Client object with REST methods
 */
export const apiClient = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
};
