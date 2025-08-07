import { PageTitle } from "@/components";
import { Bell, Heart, User } from "lucide-react";

const Notifications = () => {
    return (
        <div className="font-sans min-h-[var(--screen-minus-navbar)] w-full flex gap-4">
            <main className="flex flex-col w-full max-w-3xl h-[10000px] px-5 mx-auto justify-self-center">
                <PageTitle title="Notifications" className="sticky top-16 bg-background" />
                <div className="flex flex-col gap-4 px-4">
                    <div className="flex gap-2 items-center">
                        <User
                            size={32}
                            className="text-foreground-muted"
                        />
                        <div className="flex flex-col gap-0.5">
                            <p className="text-md">
                                Followed you
                            </p>
                            <p className="text-sm text-foreground-muted">10 minutes ago</p>
                        </div>
                    </div>
                    <hr className="w-full border-foreground-muted" />
                    <div className="flex gap-2 items-center">
                        <Heart
                            size={32}
                            fill="#ff70ac"
                            className="text-foreground-muted"
                        />
                        <div className="flex flex-col gap-0.5">
                            <p className="text-md">UserName and 10 others Liked your post</p>
                            <p className="text-sm text-foreground-muted">10 minutes ago</p>
                        </div>
                    </div>
                    <hr className="w-full border-foreground-muted" />
                    <div className="flex gap-2 items-center">
                        <Bell
                            size={32}
                            className="text-foreground-muted"
                        />
                        <div className="flex flex-col gap-0.5">
                            <p className="text-md">
                                <span className="font-bold">UserName</span> and 5 others posted a new post
                            </p>
                            <p className="text-sm text-foreground-muted">10 minutes ago</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Notifications;