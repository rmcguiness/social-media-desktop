'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { getAuthToken } from '@/app/actions/auth';

type LikeResponse = {
  liked: boolean;
  likes: number;
};

export function useLikePost(postId: number, initialLikes: number, initialLikedByMe: boolean) {
  const [likes, setLikes] = useState(initialLikes);
  const [likedByMe, setLikedByMe] = useState(initialLikedByMe);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLike = useCallback(async () => {
    setIsLoading(true);

    try {
      // Check auth BEFORE optimistic update
      const token = await getAuthToken();
      
      if (!token) {
        setIsLoading(false);
        // Redirect to login or show auth modal
        window.location.href = '/login';
        return;
      }

      // Optimistic update (only after auth check)
      const prevLikes = likes;
      const prevLikedByMe = likedByMe;
      
      setLikes(prev => likedByMe ? prev - 1 : prev + 1);
      setLikedByMe(prev => !prev);

      const response = await apiClient.post<LikeResponse>(
        `/api/likes/${postId}/toggle`,
        undefined,
        { token }
      );

      // Update with real values from server
      setLikes(response.likes);
      setLikedByMe(response.liked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Note: prevLikes/prevLikedByMe only exist if we got past auth check
    } finally {
      setIsLoading(false);
    }
  }, [postId, likes, likedByMe]);

  return {
    likes,
    likedByMe,
    isLoading,
    toggleLike,
  };
}
