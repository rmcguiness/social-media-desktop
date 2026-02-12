import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';
import { User } from '@/types/user-type';
import { getAuthToken } from '@/app/actions/auth';

export type MeResponse = {
  user: User;
};

export type UpdateProfileData = {
  name?: string;
  username?: string;
  bio?: string | null;
  image?: string | null;
  coverImage?: string | null;
};

export const usersService = {
  /**
   * Get the authenticated user's profile
   */
  async me(token?: string): Promise<MeResponse> {
    const authToken = token || await getAuthToken();
    
    if (!authToken) {
      throw new Error('Not authenticated');
    }
    
    return apiClient.get<MeResponse>(API_ENDPOINTS.me, {
      token: authToken,
      revalidate: 60,
      tags: ['user-me'],
    });
  },

  /**
   * Get a user by ID
   */
  async getById(id: number): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.user(id), {
      revalidate: 60,
      tags: [`user-${id}`],
    });
  },

  /**
   * Get a user by username
   */
  async byUsername(username: string): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.userByUsername(username), {
      revalidate: 60,
      tags: [`user-username-${username}`],
    });
  },

  /**
   * Update the authenticated user's profile
   */
  async updateProfile(data: UpdateProfileData, token: string): Promise<MeResponse> {
    return apiClient.put<MeResponse>('/api/auth/profile', data, {
      token,
      cache: 'no-store',
    });
  },

  /**
   * Check if a username is available
   */
  async checkUsername(username: string): Promise<{ available: boolean }> {
    return apiClient.get<{ available: boolean }>(`/api/auth/check-username/${username}`, {
      cache: 'no-store',
    });
  },
};
