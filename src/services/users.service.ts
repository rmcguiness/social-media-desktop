import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';
import { User } from '@/types/user-type';
import { getAuthToken } from '@/app/actions/auth';

export type MeResponse = {
  user: User & { email: string };
};

export const usersService = {
  /**
   * Get the authenticated user's profile
   */
  async me(): Promise<MeResponse> {
    const token = await getAuthToken();
    return apiClient.get<MeResponse>(API_ENDPOINTS.me, {
      token,
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
};
