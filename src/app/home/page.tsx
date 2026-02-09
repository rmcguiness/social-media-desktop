import { Post, PageTitle } from "@/components";
import { Filter } from "lucide-react";
import RightBar from "./_components/right-bar";
import { postsService } from "@/services/posts.service";

export default async function Home() {
    // Fetch data on the server
    const {data} = await postsService.list(20);
    const posts = data ?? [];
    const comments = data?? [];

    return (
        <main className="font-sans flex gap-4 min-h-[var(--screen-minus-navbar)] mx-auto px-4 mb-10">
            <div className="flex flex-8/12 flex-col max-w-4xl ">
                <PageTitle title="For You Page">
                    <button className="text-sm font-bold text-foreground-muted">
                        <Filter size={24} />
                    </button>
                </PageTitle>
                <div className="flex flex-col gap-4">
                    {posts.length === 0 ? (
                        <p>No posts yet. Be the first to post!</p>
                    ) : (
                        posts.map((post) => (
                            <Post key={post.id} post={post} />
                        ))
                    )}
                </div>
            </div>
            <RightBar comments={comments} />
        </main>
    );
}
