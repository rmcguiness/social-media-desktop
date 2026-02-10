import { PageTitle, Post } from "@/components";
import { usersService } from "@/services/users.service";
import { postsService } from "@/services/posts.service";
import Image from "next/image";

export default async function Profile() {
    let user = null;
    let userPosts = [];
    let error = null;

    try {
        const meResponse = await usersService.me();
        user = meResponse.user;

        // Get all posts and filter for this user's posts
        const { data: allPosts } = await postsService.list(100);
        userPosts = allPosts.filter(post => post.user.id === user.id);
    } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to load profile';
        console.error('Error fetching profile:', err);
    }

    return (
        <div className="font-sans min-h-[var(--screen-minus-navbar)] w-full flex gap-4">
            <main className="flex flex-col w-full max-w-4xl mx-auto px-5">
                <PageTitle title="Profile" />
                
                {error ? (
                    <div className="text-center py-8">
                        <p className="text-red-500">Error: {error}</p>
                        <p className="text-sm text-foreground-muted mt-2">
                            Make sure you&apos;re logged in and the backend server is running.
                        </p>
                    </div>
                ) : user ? (
                    <>
                        {/* Profile Header */}
                        <div className="flex flex-col items-center gap-4 py-8 border-b border-foreground-muted">
                            <Image
                                src={user.image || 'https://via.placeholder.com/150'}
                                alt={user.name}
                                width={120}
                                height={120}
                                className="rounded-full"
                            />
                            <div className="text-center">
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                <p className="text-foreground-muted">@{user.username}</p>
                                <p className="text-sm text-foreground-muted mt-1">{user.email}</p>
                            </div>
                            <div className="flex gap-6 text-sm">
                                <div className="text-center">
                                    <p className="font-bold text-lg">{userPosts.length}</p>
                                    <p className="text-foreground-muted">Posts</p>
                                </div>
                            </div>
                        </div>

                        {/* User's Posts */}
                        <div className="flex flex-col gap-4 mt-6">
                            <h2 className="text-xl font-bold">Your Posts</h2>
                            {userPosts.length === 0 ? (
                                <p className="text-center py-8 text-foreground-muted">
                                    No posts yet. Create your first post!
                                </p>
                            ) : (
                                userPosts.map((post) => (
                                    <Post key={post.id} post={post} />
                                ))
                            )}
                        </div>
                    </>
                ) : null}
            </main>
        </div>
    );
}