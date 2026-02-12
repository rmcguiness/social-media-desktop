import { PageTitle, Card, UserPostsList } from "@/components";
import { usersService } from "@/services/users.service";
import { postsService } from "@/services/posts.service";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/types/user-type";
import { getAvatarUrl } from "@/lib/avatar";
import { Settings, LogIn } from "lucide-react";
import { getAuthToken } from "@/app/actions/auth";

export default async function Profile() {
    const token = await getAuthToken();
    let isAuthenticated = !!token;
    
    let user: User | null = null;
    let userPostsData: { data: any[]; meta: { nextCursor: number | null } } = {
        data: [],
        meta: { nextCursor: null },
    };
    let error = null;

    if (isAuthenticated && token) {
        try {
            const meResponse = await usersService.me(token);
            user = meResponse.user;

            // Get user's posts with pagination
            userPostsData = await postsService.byUser(user.id, 20);
        } catch (err) {
            // Token is invalid/expired - treat as unauthenticated
            console.error('Invalid token, treating as unauthenticated:', err);
            isAuthenticated = false;
        }
    }

    return (
        <div className="w-full min-h-screen">
            <main className="flex flex-col w-full max-w-4xl mx-auto px-3 md:px-6 py-4">
                <div className="flex items-center justify-between mb-6">
                    <PageTitle title="Profile" />
                    {isAuthenticated && (
                        <Link 
                            href="/settings"
                            className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg hover:bg-accent/10 transition-colors"
                        >
                            <Settings size={18} />
                            <span className="text-sm font-medium">Edit Profile</span>
                        </Link>
                    )}
                </div>
                
                {!isAuthenticated ? (
                    <Card className="p-12 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                                <LogIn size={40} className="text-accent" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Sign in to view your profile</h2>
                            <p className="text-foreground-muted">
                                Create an account or log in to manage your profile, posts, and settings.
                            </p>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/login"
                                className="px-6 py-3 text-sm font-medium border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-3 text-sm font-semibold bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </Card>
                ) : error ? (
                    <Card className="p-8 text-center">
                        <p className="text-red-500">Error: {error}</p>
                        <p className="text-sm text-foreground-muted mt-2">
                            Unable to load profile. Please try again later.
                        </p>
                    </Card>
                ) : user ? (
                    <>
                        {/* Profile Header with Cover */}
                        <Card className="overflow-hidden mb-6">
                            {/* Cover Photo */}
                            <div 
                                className="h-32 md:h-48 bg-gradient-to-r from-accent to-accent/60"
                                style={user.coverImage ? {
                                    backgroundImage: `url(${user.coverImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                } : undefined}
                            />
                            
                            {/* Profile Info */}
                            <div className="px-6 pb-6">
                                {/* Avatar - overlapping cover */}
                                <div className="-mt-16 mb-4">
                                    <Image
                                        src={getAvatarUrl(user)}
                                        alt={user.name}
                                        width={120}
                                        height={120}
                                        className="rounded-full ring-4 ring-card"
                                    />
                                </div>
                                
                                <div className="space-y-3">
                                    <div>
                                        <h1 className="text-2xl font-bold">{user.name}</h1>
                                        <p className="text-foreground-muted">@{user.username}</p>
                                    </div>
                                    
                                    {user.bio && (
                                        <p className="text-foreground leading-relaxed">{user.bio}</p>
                                    )}
                                    
                                    <div className="flex gap-6 pt-2 text-sm">
                                        <div className="text-center">
                                            <p className="font-bold text-lg">{userPostsData.data.length}{userPostsData.meta.nextCursor ? '+' : ''}</p>
                                            <p className="text-foreground-muted">Posts</p>
                                        </div>
                                        {/* Placeholder for future follower counts */}
                                        <div className="text-center">
                                            <p className="font-bold text-lg">0</p>
                                            <p className="text-foreground-muted">Followers</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-lg">0</p>
                                            <p className="text-foreground-muted">Following</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* User's Posts */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">Your Posts</h2>
                            <UserPostsList
                                userId={user.id}
                                initialPosts={userPostsData.data}
                                initialNextCursor={userPostsData.meta.nextCursor}
                            />
                        </div>
                    </>
                ) : null}
            </main>
        </div>
    );
}