import Image from "next/image";
import type { Comment as CommentType } from "@/services/comments.service";

interface CommentProps {
    comment: CommentType;
}

const Comment = ({ comment }: CommentProps) => {
    const { content, user, createdAt } = comment;
    
    // Calculate time ago
    const getTimeAgo = (dateString: string) => {
        const time = new Date(dateString);
        const diffInSeconds = Math.floor((new Date().getTime() - time.getTime()) / 1000);
        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays}d ago`;
        return time.toLocaleDateString();
    };

    return (
        <div className="flex gap-3 py-2">
            {/* User Avatar */}
            <div className="flex-shrink-0">
                <Image 
                    src={user.image || 'https://via.placeholder.com/40'} 
                    alt={user.name} 
                    width={40} 
                    height={40} 
                    className="rounded-full ring-2 ring-border" 
                />
            </div>
            
            {/* Comment Content */}
            <div className="flex-1 min-w-0">
                <div className="bg-background rounded-lg px-4 py-3">
                    <p className="text-sm font-semibold text-foreground mb-1">{user.name}</p>
                    <p className="text-sm text-foreground leading-relaxed break-words">
                        {content}
                    </p>
                </div>
                <p className="text-xs text-foreground-muted mt-1 ml-4">
                    {getTimeAgo(createdAt)}
                </p>
            </div>
        </div>
    );
}

export default Comment;