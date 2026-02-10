import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';

export type Comment = {
  id: number;
  content: string;
  userId: number;
  postId: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
    name: string;
    image: string | null;
  };
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    nextCursor: number | null;
  };
};

export type CreateCommentData = {
  content: string;
};

export const commentsService = {
  /**
   * Get comments for a post
   */
  async list(postId: number, limit = 50): Promise<PaginatedResponse<Comment>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    return apiClient.get<PaginatedResponse<Comment>>(
      `${API_ENDPOINTS.comments}/${postId}?${params.toString()}`,
      {
        revalidate: 10, // Revalidate every 10 seconds
        tags: [`post-${postId}-comments`],
      }
    );
  },

  /**
   * Create a new comment (requires authentication)
   */
  async create(postId: number, data: CreateCommentData, token: string): Promise<Comment> {
    return apiClient.post<Comment>(`${API_ENDPOINTS.comments}/${postId}`, data, {
      token,
      cache: 'no-store',
    });
  },
};
