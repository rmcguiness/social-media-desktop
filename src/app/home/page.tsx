import SideBar from "@/components/sidebar/sidebar";
import Post from "@/components/post/post";
import { mockPosts } from "@/mocks/mockPosts";

export default function Home() {
    return (
        <div className="font-sans min-h-[var(--screen-minus-navbar)] flex scroll-smooth">
            <SideBar />
            <main className="flex flex-col w-full mx-5 max-w-2xl justify-self-center">
                <h1 className="text-2xl font-bold">Home</h1>
                <div className="flex flex-col gap-4">
                    {mockPosts.map((post) => (
                        <Post key={post.id} post={post} />
                    ))}
                    {Array.from({ length: 10 }).map((_, index) => (
                        <Post key={index} post={mockPosts[index % mockPosts.length]} />
                    ))}
                </div>
            </main>
        </div>
    );
}