import { Post, PageTitle, Card } from "@/components";
import { mockPosts } from "@/mocks/mockPosts";
import { Filter } from "lucide-react";
import RightBar from "./_components/right-bar";

export default function Home() {
    return (
        <main className="font-sans flex gap-4 min-h-[var(--screen-minus-navbar)] mx-auto px-4 mb-10">
            <div className="flex flex-8/12 flex-col max-w-4xl ">
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