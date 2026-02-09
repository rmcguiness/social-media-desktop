import { API_BASE_URL } from '@/config/api';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  token?: string;
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
};

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { 
    method = 'GET', 
    body, 
    headers = {}, 
    token,
    cache,
    revalidate,
    tags,
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  // Add Next.js cache configuration for Server Components
  if (cache) {
    config.cache = cache;
  }
  
  if (revalidate !== undefined) {
    config.next = { revalidate };
  }
  
  if (tags) {
    config.next = { ...config.next, tags };
  }

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || 'An error occurred',
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { method: 'GET', ...options }),
  
  post: <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { method: 'POST', body, ...options }),
  
  put: <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { method: 'PUT', body, ...options }),
  
  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),
  
  patch: <T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body, ...options }),
};

export { ApiError };
