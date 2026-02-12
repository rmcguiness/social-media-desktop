'use client';

import { useState } from 'react';
import { Post } from '@/components';
import { postsService } from '@/services/posts.service';
import type { Post as PostType } from '@/types/post-type';
import { Card } from '@/components';

type UserPostsListProps = {
  userId: number;
  initialPosts: PostType[];
  initialNextCursor: number | null;
};

export function UserPostsList({
  userId,
  initialPosts,
  initialNextCursor,
}: UserPostsListProps) {
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const [nextCursor, setNextCursor] = useState<number | null>(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    if (!nextCursor || isLoading) return;

    setIsLoading(true);
    try {
      const result = await postsService.byUser(userId, 20, nextCursor);
      setPosts((prev) => [...prev, ...result.data]);
      setNextCursor(result.meta.nextCursor);
    } catch (error) {
      console.error('Failed to load more posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (posts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-foreground-muted">
          No posts yet. Create your first post!
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>

      {nextCursor && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2 border border-border rounded-lg hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Load More Posts'}
          </button>
        </div>
      )}
    </>
  );
}
