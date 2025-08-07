import { Notification, PageTitle } from "@/components";
import { mockNotifications } from "@/mocks/mockNotifications";
import { Bell, Heart } from "lucide-react";

const Notifications = () => {
    return (
        <div className="font-sans min-h-[var(--screen-minus-navbar)] w-full flex gap-4">
            <main className="flex flex-col w-full max-w-3xl px-5 mx-auto justify-self-center">
                <PageTitle title="Notifications" className="sticky top-16 bg-background" />
                <div className="flex flex-col gap-4 px-4">
                    {mockNotifications.map((notification, index) => (
                        <div key={notification.id} className="flex flex-col gap-2">
                            <Notification key={notification.id} type={notification.type} data={notification.data} />
                            {index !== mockNotifications.length - 1 && <hr className="w-full border-foreground-muted" />}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Notifications;