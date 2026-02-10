import { Notification, PageTitle } from "@/components";
import { notificationsService } from "@/services/notifications.service";

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
        <div className="font-sans min-h-[var(--screen-minus-navbar)] w-full flex gap-4">
            <main className="flex flex-col w-full max-w-3xl px-5 mx-auto justify-self-center">
                <PageTitle title="Notifications" className="sticky top-16 bg-background" />
                <div className="flex flex-col gap-2 px-4 mt-4">
                    {error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500">Error: {error}</p>
                            <p className="text-sm text-foreground-muted mt-2">
                                Make sure you&apos;re logged in and the backend server is running.
                            </p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <p className="text-center py-8 text-foreground-muted">
                            No notifications yet
                        </p>
                    ) : (
                        notifications.map((notification, index) => (
                            <div key={notification.id}>
                                <Notification notification={notification} />
                                {index !== notifications.length - 1 && (
                                    <hr className="w-full border-foreground-muted opacity-20" />
                                )}
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}