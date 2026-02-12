import { Notification, PageTitle, Card } from "@/components";
import { notificationsService, type Notification as NotificationType } from "@/services/notifications.service";
import { Bell, BellOff, LogIn } from "lucide-react";
import { getAuthToken } from "@/app/actions/auth";
import Link from "next/link";

export default async function Notifications() {
    const token = await getAuthToken();
    let isAuthenticated = !!token;
    
    let notifications: NotificationType[] = [];
    let error: string | null = null;

    if (isAuthenticated) {
        try {
            const response = await notificationsService.list(20);
            notifications = response.data;
        } catch (err) {
            // Token is invalid/expired - treat as unauthenticated
            console.error('Invalid token, treating as unauthenticated:', err);
            isAuthenticated = false;
        }
    }

    return (
        <div className="w-full min-h-screen">
            <div className="flex gap-6 px-3 md:px-6 py-4 max-w-7xl mx-auto">
                {/* Main Content */}
                <div className="flex-1 max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <PageTitle title="Notifications">
                            <button className="p-2 hover:bg-background rounded-full transition-colors" aria-label="Mark all as read">
                                <Bell size={20} className="text-foreground-muted" />
                            </button>
                        </PageTitle>
                    </div>

                    {/* Notifications List */}
                    <div className="flex flex-col gap-3">
                        {!isAuthenticated ? (
                            <Card className="p-12 text-center space-y-6">
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                                        <LogIn size={40} className="text-accent" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold">Sign in to view notifications</h2>
                                    <p className="text-foreground-muted">
                                        Log in to see your notifications and stay updated on interactions with your posts.
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
                                <div className="flex flex-col items-center gap-3">
                                    <BellOff size={48} className="text-red-500" />
                                    <p className="text-red-500 font-semibold">Error: {error}</p>
                                    <p className="text-sm text-foreground-muted">
                                        Unable to load notifications. Please try again later.
                                    </p>
                                </div>
                            </Card>
                        ) : notifications.length === 0 ? (
                            <div className="card p-8 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <BellOff size={48} className="text-foreground-muted" />
                                    <p className="text-foreground-muted text-lg">
                                        No notifications yet
                                    </p>
                                    <p className="text-sm text-foreground-muted">
                                        You&apos;ll see notifications here when someone interacts with your posts
                                    </p>
                                </div>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <Notification key={notification.id} notification={notification} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}