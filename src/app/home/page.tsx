import { Post, PageTitle, Card } from "@/components";
import { mockPosts } from "@/mocks/mockPosts";
import { Filter } from "lucide-react";
import RightBar from "./_components/right-bar";

export default function Home() {
    return (
        <main className="font-sans min-h-[var(--screen-minus-navbar)] mx-auto mb-10 flex scroll-smooth">
            <div className="flex flex-2 flex-col w-full mx-5 max-w-3xl justify-self-center">
                <PageTitle title="For You Page">
                    <button className="text-sm font-bold text-foreground-muted">
                        <Filter size={24} />
                    </button>
                </PageTitle>
                <div className="flex flex-col gap-4">
                    {mockPosts.map((post) => (
                        <Post key={post.id} post={post} />
                    ))}
                </div>
            </div>
            <RightBar />
        </main >
    );
}