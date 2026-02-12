'use client';

import { Heart } from 'lucide-react';
import { useLikePost } from '@/lib/hooks/useLikePost';
import { cn } from '@/lib/utils';

type LikeButtonProps = {
  postId: number;
  initialLikes: number;
  initialLikedByMe: boolean;
  className?: string;
};

export function LikeButton({ postId, initialLikes, initialLikedByMe, className }: LikeButtonProps) {
  const { likes, likedByMe, isLoading, toggleLike } = useLikePost(postId, initialLikes, initialLikedByMe);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent post click when clicking like button
        toggleLike();
      }}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group",
        "hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed",
        likedByMe 
          ? "text-red-500" 
          : "text-foreground-muted hover:text-red-500",
        className
      )}
      aria-label={likedByMe ? "Unlike post" : "Like post"}
    >
      <Heart
        size={18}
        className={cn(
          "transition-all duration-200",
          likedByMe 
            ? "fill-red-500 scale-110" 
            : "group-hover:scale-110"
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {likes}
      </span>
    </button>
  );
}
