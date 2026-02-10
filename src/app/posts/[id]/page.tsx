import { Post, PageTitle, Comment, CreateComment } from "@/components";
import { postsService } from "@/services/posts.service";
import { commentsService } from "@/services/comments.service";
import { usersService } from "@/services/users.service";
import { getAuthToken } from "@/app/actions/auth";
import { notFound } from "next/navigation";
import { Card } from "@/components";

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
        
        // Fetch comments for this post
        const { data: comments } = await commentsService.list(postId, 50);
        
        // Check if user is authenticated and get user ID
        const token = await getAuthToken();
        const isAuthenticated = !!token;
        let currentUserId: number | undefined;
        
        if (isAuthenticated && token) {
            try {
                const user = await usersService.me(token);
                currentUserId = user.id;
            } catch (err) {
                // Token might be invalid, ignore
            }
        }

        return (
            <div className="w-full max-w-7xl mx-auto">
                <div className="flex gap-6 px-3 md:px-6 py-4">
                    {/* Main Content */}
                    <div className="flex-1 max-w-2xl">
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
                                
                                {/* Comments List */}
                                <div className="flex flex-col gap-4 mt-6">
                                    {comments.length === 0 ? (
                                        <p className="text-sm text-foreground-muted text-center py-4">
                                            No comments yet. Be the first to comment!
                                        </p>
                                    ) : (
                                        comments.map((comment) => (
                                            <Comment key={comment.id} comment={comment} />
                                        ))
                                    )}
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
