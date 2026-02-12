'use client';

import { useState } from 'react';
import { Comment } from '@/components';
import { commentsService, type Comment as CommentType } from '@/services/comments.service';

type CommentsListProps = {
  postId: number;
  initialComments: CommentType[];
  initialNextCursor: number | null;
  currentUserId?: number;
};

export function CommentsList({
  postId,
  initialComments,
  initialNextCursor,
  currentUserId,
}: CommentsListProps) {
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [nextCursor, setNextCursor] = useState<number | null>(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    if (!nextCursor || isLoading) return;

    setIsLoading(true);
    try {
      const result = await commentsService.list(postId, 20, nextCursor);
      setComments((prev) => [...prev, ...result.data]);
      setNextCursor(result.meta.nextCursor);
    } catch (error) {
      console.error('Failed to load more comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {comments.length === 0 ? (
          <p className="text-sm text-foreground-muted text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>

      {nextCursor && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2 border border-border rounded-lg hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Load More Comments'}
          </button>
        </div>
      )}
    </>
  );
}
