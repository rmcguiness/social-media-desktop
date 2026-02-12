import { PageTitle, CreatePost, PostFeed } from "@/components";
import { Filter } from "lucide-react";
import RightBar from "./_components/right-bar";
import { postsService } from "@/services/posts.service";
import { getAuthToken } from "@/app/actions/auth";

export default async function Home() {
    // Fetch data on the server
    const response = await postsService.list(20);
    const posts = response.data ?? [];
    const nextCursor = response.meta?.nextCursor ?? null;
    
    // Check if user is authenticated
    const token = await getAuthToken();
    const isAuthenticated = !!token;

    return (
        <div className="w-full min-h-screen">
            <div className="flex gap-6 px-3 md:px-6 py-4 max-w-7xl mx-auto">
                {/* Main Content */}
                <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
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

                    {/* Posts Feed with Infinite Scroll */}
                    <PostFeed initialPosts={posts} initialCursor={nextCursor} />
                </div>

                {/* Right Sidebar - Hidden on mobile */}
                <div className="hidden lg:block w-80 flex-shrink-0">
                    <RightBar />
                </div>
            </div>
        </div>
    );
}
