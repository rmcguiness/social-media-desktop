import { Post, PageTitle, Card } from "@/components";
import { mockPosts } from "@/mocks/mockPosts";
import { ChevronDown, Filter } from "lucide-react";

export default function Home() {
    return (
        <main className="font-sans min-h-[var(--screen-minus-navbar)] mx-auto flex scroll-smooth">
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
                    {Array.from({ length: 10 }).map((_, index) => (
                        <Post key={index} post={mockPosts[index % mockPosts.length]} />
                    ))}
                </div>
            </div>
            <div className="hidden sticky h-min top-21 md:flex flex-1 flex-col w-full max-w-md mx-5 gap-4 justify-self-center">
                <Card>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <h1 className="text-lg font-bold">Comments</h1>
                            <ChevronDown size={24} />
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <h1 className="text-lg font-bold">Trending</h1>
                            <ChevronDown size={24} />
                        </div>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <h1 className="text-lg font-bold">Communities</h1>
                            <ChevronDown size={24} />
                        </div>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                        </p>
                    </div>
                </Card>
            </div>
        </main >
    );
}