import { Heart, MessageCircle } from "lucide-react";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Notification as NotificationType } from "@/services/notifications.service";

type NotificationProps = {
    notification: NotificationType;
};

const Notification = ({ notification }: NotificationProps) => {
    const { type, actor, post, createdAt } = notification;

    const timeAgo = useMemo(() => {
        const time = new Date(createdAt);
        const diffInSeconds = Math.floor((new Date().getTime() - time.getTime()) / 1000);
        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays}d ago`;
        const diffInMonths = Math.floor(diffInDays / 30);
        return `${diffInMonths}mo ago`;
    }, [createdAt]);

    const getIcon = () => {
        if (type === "like") return <Heart size={32} fill="#ff70ac" className="text-pink-500" />;
        if (type === "comment") return <MessageCircle size={32} className="text-blue-500" />;
        return null;
    };

    const getNotificationText = () => {
        if (type === "like") {
            return (
                <>
                    <span className="font-bold">{actor.name}</span> liked your post{" "}
                    <Link href={`/posts/${post.id}`} className="text-blue-500 hover:underline">
                        &quot;{post.title}&quot;
                    </Link>
                </>
            );
        }
        return (
            <>
                <span className="font-bold">{actor.name}</span> commented on your post{" "}
                <Link href={`/posts/${post.id}`} className="text-blue-500 hover:underline">
                    &quot;{post.title}&quot;
                </Link>
            </>
        );
    };

    return (
        <div className="flex gap-3 items-start py-2">
            <div className="flex-shrink-0">
                <Image
                    src={actor.image || 'https://via.placeholder.com/40'}
                    alt={actor.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm">
                    {getNotificationText()}
                </p>
                <p className="text-xs text-foreground-muted mt-1">{timeAgo}</p>
            </div>
            <div className="flex-shrink-0">
                {getIcon()}
            </div>
        </div>
    );
};

export default Notification;