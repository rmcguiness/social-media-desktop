'use client';

import { useInfiniteScroll } from '@/lib/hooks';
import { Post as PostType } from '@/types/post-type';
import Post from './post';
import { Loader2 } from 'lucide-react';

interface PostFeedProps {
    initialPosts: PostType[];
    initialCursor: number | null;
}

export function PostFeed({ initialPosts, initialCursor }: PostFeedProps) {
    const fetchMorePosts = async (cursor: number) => {
        const params = new URLSearchParams({
            limit: '20',
            cursor: cursor.toString(),
        });
        
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/posts?${params.toString()}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        
        const result = await response.json();
        return {
            data: result.data as PostType[],
            nextCursor: result.meta?.nextCursor ?? null,
        };
    };

    const { data: posts, isLoading, hasMore, sentinelRef } = useInfiniteScroll({
        initialData: initialPosts,
        initialCursor,
        fetchMore: fetchMorePosts,
        threshold: 400,
    });

    return (
        <div className="flex flex-col gap-4">
            {posts.length === 0 ? (
                <div className="card p-8 text-center">
                    <p className="text-foreground-muted text-lg">
                        No posts yet. Be the first to post!
                    </p>
                </div>
            ) : (
                <>
                    {posts.map((post) => (
                        <Post key={post.id} post={post} />
                    ))}
                    
                    {/* Sentinel element for intersection observer */}
                    <div ref={sentinelRef} className="h-4" />
                    
                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="flex justify-center py-4">
                            <Loader2 className="w-6 h-6 animate-spin text-accent" />
                        </div>
                    )}
                    
                    {/* End of feed message */}
                    {!hasMore && posts.length > 0 && (
                        <div className="text-center py-6 text-foreground-muted text-sm">
                            You&apos;ve reached the end of the feed
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
