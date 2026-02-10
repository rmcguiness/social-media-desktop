import { Notification, PageTitle } from "@/components";
import { notificationsService } from "@/services/notifications.service";
import { Bell, BellOff } from "lucide-react";

export default async function Notifications() {
    let notifications = [];
    let error = null;

    try {
        const response = await notificationsService.list(20);
        notifications = response.data;
    } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to load notifications';
        console.error('Error fetching notifications:', err);
    }

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="flex gap-6 px-3 md:px-6 py-4">
                {/* Main Content */}
                <div className="flex-1 max-w-2xl">
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
                        {error ? (
                            <div className="card p-8 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <BellOff size={48} className="text-red-500" />
                                    <p className="text-red-500 font-semibold">Error: {error}</p>
                                    <p className="text-sm text-foreground-muted">
                                        Make sure you&apos;re logged in and the backend server is running.
                                    </p>
                                </div>
                            </div>
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