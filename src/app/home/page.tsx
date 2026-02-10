import { Post, PageTitle, CreatePost } from "@/components";
import { Filter } from "lucide-react";
import RightBar from "./_components/right-bar";
import { postsService } from "@/services/posts.service";
import { getAuthToken } from "@/app/actions/auth";

export default async function Home() {
    // Fetch data on the server
    const {data} = await postsService.list(20);
    const posts = data ?? [];
    
    // Check if user is authenticated
    const token = await getAuthToken();
    const isAuthenticated = !!token;

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="flex gap-6 px-3 md:px-6 py-4">
                {/* Main Content */}
                <div className="flex-1 max-w-2xl">
                    {/* Header */}
                    <div className="mb-6">
                        <PageTitle title="For You Page">
                            <button className="p-2 hover:bg-background rounded-full transition-colors" aria-label="Filter posts">
                                <Filter size={20} className="text-foreground-muted" />
                            </button>
                        </PageTitle>
                    </div>

                    {/* Create Post - Only show when authenticated */}
                    {isAuthenticated && <CreatePost />}

                    {/* Posts Feed */}
                    <div className="flex flex-col gap-4">
                        {posts.length === 0 ? (
                            <div className="card p-8 text-center">
                                <p className="text-foreground-muted text-lg">
                                    No posts yet. Be the first to post!
                                </p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <Post key={post.id} post={post} />
                            ))
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Hidden on mobile */}
                <div className="hidden lg:block">
                    <RightBar />
                </div>
            </div>
        </div>
    );
}
