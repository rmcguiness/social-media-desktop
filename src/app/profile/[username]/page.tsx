import { PageTitle, Card, UserPostsList } from "@/components";
import { usersService } from "@/services/users.service";
import { postsService } from "@/services/posts.service";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/types/user-type";
import { getAvatarUrl } from "@/lib/avatar";
import { Settings, UserPlus, ArrowLeft } from "lucide-react";
import { getAuthToken } from "@/app/actions/auth";
import { notFound } from "next/navigation";

type ProfilePageProps = {
    params: {
        username: string;
    };
};

export default async function UserProfile({ params }: ProfilePageProps) {
    const { username } = await params;
    const token = await getAuthToken();
    const isAuthenticated = !!token;
    
    let currentUser: User | null = null;
    let profileUser: User | null = null;
    let userPostsData: { data: any[]; meta: { nextCursor: number | null } } = {
        data: [],
        meta: { nextCursor: null },
    };

    try {
        // Get the profile user by username
        profileUser = await usersService.byUsername(username);
        
        if (!profileUser) {
            notFound();
        }

        // Get the current user if authenticated
        if (isAuthenticated && token) {
            try {
                const meResponse = await usersService.me(token);
                currentUser = meResponse.user;
            } catch (err) {
                console.error('Invalid token:', err);
            }
        }

        // Get profile user's posts
        userPostsData = await postsService.byUser(profileUser.id, 20);
    } catch (err) {
        console.error('Error loading profile:', err);
        notFound();
    }

    const isOwnProfile = currentUser?.id === profileUser.id;

    return (
        <div className="w-full min-h-screen">
            <main className="flex flex-col w-full max-w-4xl mx-auto px-3 md:px-6 py-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/"
                            className="p-2 hover:bg-background rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <PageTitle title={profileUser.name} />
                    </div>
                    {isOwnProfile ? (
                        <Link 
                            href="/settings"
                            className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg hover:bg-accent/10 transition-colors"
                        >
                            <Settings size={18} />
                            <span className="text-sm font-medium">Edit Profile</span>
                        </Link>
                    ) : isAuthenticated ? (
                        <button 
                            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                        >
                            <UserPlus size={18} />
                            <span className="text-sm font-medium">Follow</span>
                        </button>
                    ) : null}
                </div>
                
                {/* Profile Header with Cover */}
                <Card className="overflow-hidden mb-6">
                    {/* Cover Photo */}
                    <div 
                        className="h-32 md:h-48 bg-gradient-to-r from-accent to-accent/60"
                        style={profileUser.coverImage ? {
                            backgroundImage: `url(${profileUser.coverImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        } : undefined}
                    />
                    
                    {/* Profile Info */}
                    <div className="px-6 pb-6">
                        {/* Avatar - overlapping cover */}
                        <div className="-mt-16 mb-4">
                            <Image
                                src={getAvatarUrl(profileUser)}
                                alt={profileUser.name}
                                width={120}
                                height={120}
                                className="rounded-full ring-4 ring-card"
                            />
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <h1 className="text-2xl font-bold">{profileUser.name}</h1>
                                <p className="text-foreground-muted">@{profileUser.username}</p>
                            </div>
                            
                            {profileUser.bio && (
                                <p className="text-foreground leading-relaxed">{profileUser.bio}</p>
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
                    <h2 className="text-xl font-bold mb-4">
                        {isOwnProfile ? 'Your Posts' : `${profileUser.name}'s Posts`}
                    </h2>
                    <UserPostsList
                        userId={profileUser.id}
                        initialPosts={userPostsData.data}
                        initialNextCursor={userPostsData.meta.nextCursor}
                    />
                </div>
            </main>
        </div>
    );
}
