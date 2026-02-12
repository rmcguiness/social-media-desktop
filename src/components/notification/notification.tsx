'use client';

import { Heart, MessageCircle } from "lucide-react";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components";
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
        if (type === "like") {
            return (
                <div className="p-2 rounded-full bg-pink-500/10">
                    <Heart size={20} className="text-pink-500" fill="currentColor" />
                </div>
            );
        }
        if (type === "comment") {
            return (
                <div className="p-2 rounded-full bg-accent/10">
                    <MessageCircle size={20} className="text-accent" />
                </div>
            );
        }
        return null;
    };

    const getNotificationText = () => {
        if (type === "like") {
            return (
                <>
                    <span className="font-semibold text-foreground">{actor.name}</span>
                    <span className="text-foreground-muted"> liked your post </span>
                    <Link 
                        href={`/posts/${post.id}`} 
                        className="text-accent font-medium hover:underline transition-colors"
                    >
                        &quot;{post.title}&quot;
                    </Link>
                </>
            );
        }
        return (
            <>
                <span className="font-semibold text-foreground">{actor.name}</span>
                <span className="text-foreground-muted"> commented on your post </span>
                <Link 
                    href={`/posts/${post.id}`} 
                    className="text-accent font-medium hover:underline transition-colors"
                >
                    &quot;{post.title}&quot;
                </Link>
            </>
        );
    };

    return (
        <Link href={`/posts/${post.id}`} className="block">
            <Card className="cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex gap-4 items-start p-4">
                    {/* Actor Avatar */}
                    <div className="flex-shrink-0">
                        <Image
                            src={actor.image || 'https://via.placeholder.com/48'}
                            alt={actor.name}
                            width={48}
                            height={48}
                            className="rounded-full ring-2 ring-border"
                        />
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base leading-relaxed">
                            {getNotificationText()}
                        </p>
                        <p className="text-xs text-foreground-muted mt-2">{timeAgo}</p>
                    </div>

                    {/* Type Icon */}
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default Notification;