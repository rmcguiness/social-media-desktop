import { Post, PageTitle, Comment } from "@/components";
import { postsService } from "@/services/posts.service";
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
        // Comments are posts with parentId matching this post's id
        const { data: allPosts } = await postsService.list(100);
        const comments = allPosts.filter((p) => p.parentId === postId);

        return (
            <main className="font-sans flex gap-4 min-h-[var(--screen-minus-navbar)] mx-auto px-4 mb-10">
                <div className="flex flex-col max-w-4xl w-full gap-4">
                    <PageTitle title="Post" />
                    
                    {/* Main Post */}
                    <Post post={post} clickable={false} />

                    {/* Comments Section */}
                    <Card>
                        <div className="m-4">
                            <h2 className="text-lg font-bold mb-4">
                                Comments ({comments.length})
                            </h2>
                            <div className="flex flex-col gap-4">
                                {comments.length === 0 ? (
                                    <p className="text-sm text-foreground-muted">
                                        No comments yet. Be the first to comment!
                                    </p>
                                ) : (
                                    comments.map((comment) => (
                                        <Comment key={comment.id} post={comment} />
                                    ))
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        );
    } catch (error) {
        console.error('Error fetching post:', error);
        notFound();
    }
}
