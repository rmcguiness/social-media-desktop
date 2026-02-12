import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';

export type Comment = {
  id: number;
  content: string;
  userId: number;
  postId?: number;
  parentId?: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
    name: string;
    image: string | null;
  };
  replies?: Comment[];
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    nextCursor: number | null;
  };
};

export type CreateCommentData = {
  content: string;
  parentId?: number;
};

export type UpdateCommentData = {
  content: string;
};

export const commentsService = {
  /**
   * Get comments for a post
   */
  async list(postId: number, limit = 50, cursor?: number): Promise<PaginatedResponse<Comment>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });
    
    if (cursor !== undefined) {
      params.append('cursor', cursor.toString());
    }

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

  /**
   * Update a comment (requires authentication, owner only)
   */
  async update(commentId: number, data: UpdateCommentData, token: string): Promise<Comment> {
    return apiClient.put<Comment>(`${API_ENDPOINTS.comments}/comment/${commentId}`, data, {
      token,
      cache: 'no-store',
    });
  },

  /**
   * Delete a comment (requires authentication, owner only)
   */
  async delete(commentId: number, token: string): Promise<void> {
    return apiClient.delete<void>(`${API_ENDPOINTS.comments}/comment/${commentId}`, {
      token,
      cache: 'no-store',
    });
  },
};
