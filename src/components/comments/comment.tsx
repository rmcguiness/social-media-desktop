'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Comment as CommentType } from "@/services/comments.service";
import { getAvatarUrl } from "@/lib/avatar";
import { CommentActions } from "./comment-actions";
import { commentsService } from "@/services/comments.service";
import { getAuthToken } from "@/app/actions/auth";
import { revalidateHomeFeed, revalidatePostPage } from "@/app/actions/posts";
import { Send, MessageCircle } from "lucide-react";

interface CommentProps {
    comment: CommentType;
    postId: number;
    currentUserId?: number;
    depth?: number;
}

const Comment = ({ comment, postId, currentUserId, depth = 0 }: CommentProps) => {
    const router = useRouter();
    const { id, content, user, userId, createdAt, replies = [] } = comment;
    const isOwner = currentUserId !== undefined && userId === currentUserId;
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    
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

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!replyContent.trim()) return;
        
        setError('');
        setIsSubmitting(true);

        try {
            const token = await getAuthToken();
            if (!token) {
                router.push('/login');
                return;
            }

            await commentsService.create(postId, { 
                content: replyContent.trim(),
                parentId: id,
            }, token);

            // Reset form
            setReplyContent('');
            setShowReplyForm(false);
            
            // Revalidate caches to show new reply
            await revalidateHomeFeed();
            await revalidatePostPage(postId);
            
            // Refresh page to show new reply
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to post reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Limit nesting depth to avoid UI issues
    const maxDepth = 3;
    const canReply = depth < maxDepth && currentUserId !== undefined;

    return (
        <div className={`flex gap-3 py-2 ${depth > 0 ? 'ml-12' : ''}`}>
            {/* User Avatar */}
            <div className="flex-shrink-0">
                <Image 
                    src={getAvatarUrl(user)} 
                    alt={user.name} 
                    width={depth > 0 ? 32 : 40} 
                    height={depth > 0 ? 32 : 40} 
                    className="rounded-full ring-2 ring-border" 
                />
            </div>
            
            {/* Comment Content */}
            <div className="flex-1 min-w-0">
                <div className="bg-background rounded-lg px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                        <CommentActions 
                            commentId={id}
                            postId={postId}
                            content={content}
                            isOwner={isOwner}
                        />
                    </div>
                    <p className="text-sm text-foreground leading-relaxed break-words mt-1">
                        {content}
                    </p>
                </div>
                
                {/* Comment metadata and reply button */}
                <div className="flex items-center gap-3 mt-1 ml-4">
                    <p className="text-xs text-foreground-muted">
                        {getTimeAgo(createdAt)}
                    </p>
                    
                    {canReply && (
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
                        >
                            <MessageCircle size={14} />
                            Reply
                        </button>
                    )}
                </div>

                {/* Reply form */}
                {showReplyForm && (
                    <div className="mt-3 ml-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2 rounded-lg mb-2 text-xs">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleReplySubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={`Reply to ${user.name}...`}
                                maxLength={1000}
                                className="input-field flex-1 text-sm"
                                disabled={isSubmitting}
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || !replyContent.trim()}
                                className="btn-primary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                                <Send size={14} />
                                {isSubmitting ? 'Posting...' : 'Reply'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Nested replies */}
                {replies.length > 0 && (
                    <div className="mt-3">
                        {replies.map((reply) => (
                            <Comment
                                key={reply.id}
                                comment={reply}
                                postId={postId}
                                currentUserId={currentUserId}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Comment;