import { User as UserType } from "@/types/user-type";
import { Bell, Heart, MessageCircle, User } from "lucide-react"
import { useMemo } from "react";

type NotificationProps = {
    type: "follow" | "like" | "subscribed" | "comment",
    data: {
        user: UserType,
        others?: UserType[]
        time: Date
    }
}

const Notification = ({ type, data }: NotificationProps) => {
    const { user, others, time } = data;
    const timeAgo = useMemo(() => {
        const diffInSeconds = Math.floor((new Date().getTime() - time.getTime()) / 1000);
        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays}d ago`;
        const diffInMonths = Math.floor(diffInDays / 30);
        return `${diffInMonths}m ago`;
    }, [time]);

    const getIcon = () => {
        if (type === "follow") return <User size={32} className="text-foreground-muted" />;
        if (type === "like") return <Heart size={32} fill="#ff70ac" className="text-foreground-muted" />;
        if (type === "subscribed") return <Bell size={32} className="text-foreground-muted" />;
        if (type === "comment") return <MessageCircle size={32} className="text-foreground-muted" />;
        return null;
    }

    const getNotificationText = () => {
        if (type === "follow") return <><span className="font-bold">{user.name}</span> {others?.length ? `and ${others?.length} others` : ""} followed you</>;
        if (type === "like") return <><span className="font-bold">{user.name}</span> {others?.length ? `and ${others?.length} others` : ""} liked your post</>;
        if (type === "subscribed") return <><span className="font-bold">{user.name}</span> {others?.length ? `and ${others?.length} others` : ""} subscribed to your channel</>;
        return <><span className="font-bold">{user.name}</span> {others?.length ? `and ${others?.length} others` : ""} commented on your post</>;
    }

    return (
        <div className="flex gap-2 items-center">
            {getIcon()}
            <div className="flex flex-col gap-0.5">
                <p className="text-md">
                    {getNotificationText()}
                </p>
                <p className="text-sm text-foreground-muted">{timeAgo}</p>
            </div>
        </div>
    )
}

export default Notification;