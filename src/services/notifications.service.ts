import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';
import { getAuthToken } from '@/app/actions/auth';

export type NotificationType = 'like' | 'comment';

export type Notification = {
  id: string;
  type: NotificationType;
  userId: number;
  actorId: number;
  postId: number;
  createdAt: Date;
  actor: {
    id: number;
    name: string;
    username: string;
    image: string | null;
  };
  post: {
    id: number;
    title: string;
  };
};

export type NotificationsResponse = {
  data: Notification[];
};

export const notificationsService = {
  /**
   * Get notifications for the authenticated user
   * Uses Next.js caching with 30 second revalidation
   */
  async list(limit = 20): Promise<NotificationsResponse> {
    const token = await getAuthToken();
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    return apiClient.get<NotificationsResponse>(
      `${API_ENDPOINTS.notifications}?${params.toString()}`,
      {
        token,
        revalidate: 30, // Revalidate every 30 seconds
        tags: ['notifications'],
      }
    );
  },
};
