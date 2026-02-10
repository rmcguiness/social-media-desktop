import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';
import { Post } from '@/types/post-type';

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    nextCursor: number | null;
  };
};

export type CreatePostData = {
  title: string;
  content: string;
  image?: string;
  parentId?: number;
};

export const postsService = {
  /**
   * Get paginated list of posts
   * Uses Next.js caching with 60 second revalidation
   */
  async list(limit = 20, cursor?: number): Promise<PaginatedResponse<Post>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });
    
    if (cursor) {
      params.append('cursor', cursor.toString());
    }

    return apiClient.get<PaginatedResponse<Post>>(
      `${API_ENDPOINTS.posts}?${params.toString()}`,
      {
        revalidate: 60, // Revalidate every 60 seconds
        tags: ['posts'], // Tag for on-demand revalidation
      }
    );
  },

  /**
   * Get a single post by ID
   * Uses Next.js caching with 60 second revalidation
   */
  async getById(id: number): Promise<Post> {
    return apiClient.get<Post>(API_ENDPOINTS.post(id), {
      revalidate: 60,
      tags: [`post-${id}`],
    });
  },

  /**
   * Create a new post (requires authentication)
   * No caching for mutations
   */
  async create(data: CreatePostData, token: string): Promise<Post> {
    return apiClient.post<Post>(API_ENDPOINTS.posts, data, {
      token,
      cache: 'no-store', // Don't cache mutations
    });
  },

  /**
   * Update a post (requires authentication)
   * No caching for mutations
   */
  async update(id: number, data: Partial<CreatePostData>, token: string): Promise<Post> {
    return apiClient.put<Post>(API_ENDPOINTS.post(id), data, {
      token,
      cache: 'no-store',
    });
  },

  /**
   * Delete a post (requires authentication)
   * No caching for mutations
   */
  async delete(id: number, token: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.post(id), {
      token,
      cache: 'no-store',
    });
  },
};
