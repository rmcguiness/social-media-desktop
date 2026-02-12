import { API_ENDPOINTS, API_BASE_URL } from '@/config/api';

export type LoginData = {
  emailOrUsername: string;
  password: string;
};

export type RegisterData = {
  email: string;
  username: string;
  name: string;
  password: string;
};

export type AuthResponse = {
  user: {
    id: number;
    email: string;
    username: string;
    name: string;
    image: string | null;
  };
  accessToken: string;
  refreshToken: string;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RegisterResponse = {
  message: string;
  email: string;
};

export const authService = {
  /**
   * Login user
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  /**
   * Register new user (sends verification email)
   */
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.register}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  /**
   * Refresh access token using refresh token
   */
  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.refresh}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Token refresh failed' }));
      throw new Error(error.message || 'Token refresh failed');
    }

    return response.json();
  },

  /**
   * Logout user (revokes refresh token on server)
   */
  async logout(refreshToken: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}${API_ENDPOINTS.logout}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        cache: 'no-store',
      });
    } catch (error) {
      // Ignore logout errors (client will clear tokens anyway)
      console.error('Logout error:', error);
    }
  },
};
