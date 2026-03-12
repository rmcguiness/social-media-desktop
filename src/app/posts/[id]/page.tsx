import { Post, PageTitle } from "@/components";
import { CommentsListSkeleton } from "@/components/ui/skeletons";
import { BackButton } from "@/components/ui/back-button";
import { postsService } from "@/services/posts.service";
import { commentsService, type Comment } from "@/services/comments.service";
import { usersService } from "@/services/users.service";
import { getAuthToken } from "@/app/actions/auth";
import { notFound } from "next/navigation";
import { Card } from "@/components";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CommentsList = dynamic(
    () => import("@/components/comments/comments-list").then((mod) => ({ default: mod.CommentsList })),
    { loading: () => <CommentsListSkeleton /> }
);

const CreateComment = dynamic(
    () => import("@/components/comments/create-comment"),
    { loading: () => <div className="animate-pulse h-24 bg-background rounded-lg" /> }
);

type PostPageProps = {
    params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
    const { id } = await params;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
        notFound();
    }

    try {
        // Fetch the main post
        const post = await postsService.getById(postId);
        
        // Fetch comments for this post with error handling
        let comments: Comment[] = [];
        let nextCursor: number | null = null;
        try {
            const result = await commentsService.list(postId, 20);
            comments = result?.data || [];
            nextCursor = result?.meta?.nextCursor || null;
        } catch (err) {
            console.error('Failed to load comments:', err);
            // Continue with empty comments array
        }
        
        // Check if user is authenticated and get user ID
        const token = await getAuthToken();
        const isAuthenticated = !!token;
        let currentUserId: number | undefined;
        
        if (isAuthenticated && token) {
            try {
                const response = await usersService.me(token);
                currentUserId = response.user.id;
            } catch {
                // Token might be invalid, ignore
            }
        }

        return (
            <div className="w-full min-h-screen">
                <div className="flex gap-6 px-3 md:px-6 py-4 max-w-7xl mx-auto">
                    {/* Main Content */}
                    <div className="flex-1 max-w-2xl mx-auto">
                        {/* Back Button */}
                        <div className="mb-4">
                            <BackButton />
                        </div>
                        
                        {/* Header */}
                        <div className="mb-6">
                            <PageTitle title="Post" />
                        </div>
                        
                        {/* Main Post */}
                        <Post post={post} clickable={false} currentUserId={currentUserId} />

                        {/* Comments Section */}
                        <Card className="mt-4">
                            <div className="p-4 md:p-5">
                                <h2 className="text-xl font-bold mb-4">
                                    Comments ({comments.length})
                                </h2>
                                
                                {/* Comment Form - Only show when authenticated */}
                                {isAuthenticated && <CreateComment postId={postId} />}

                                {/* Comments List with Pagination */}
                                <div className="mt-6">
                                    <Suspense fallback={<CommentsListSkeleton />}>
                                        <CommentsList
                                            postId={postId}
                                            initialComments={comments}
                                            initialNextCursor={nextCursor}
                                            currentUserId={currentUserId}
                                        />
                                    </Suspense>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching post:', error);
        notFound();
    }
}
