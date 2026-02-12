'use client';

import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, X, Check } from 'lucide-react';
import { updateComment, deleteComment } from '@/app/actions/comments';

interface CommentActionsProps {
    commentId: number;
    postId: number;
    content: string;
    isOwner: boolean;
}

export function CommentActions({ commentId, postId, content, isOwner }: CommentActionsProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(content);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (!isOwner) return null;

    const handleEdit = async () => {
        if (editContent.trim() === content) {
            setIsEditing(false);
            return;
        }

        setIsLoading(true);
        try {
            const result = await updateComment(commentId, postId, editContent.trim());
            if (result.error) {
                console.error(result.error);
            } else {
                setIsEditing(false);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const result = await deleteComment(commentId, postId);
            if (result.error) {
                console.error(result.error);
            }
            setShowDeleteConfirm(false);
        } finally {
            setIsLoading(false);
        }
    };

    if (isEditing) {
        return (
            <div className="flex-1 mt-2">
                <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                    rows={2}
                    disabled={isLoading}
                />
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={handleEdit}
                        disabled={isLoading || !editContent.trim()}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Check size={14} />
                        Save
                    </button>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setEditContent(content);
                        }}
                        disabled={isLoading}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-background-secondary text-foreground rounded-lg hover:bg-opacity-80"
                    >
                        <X size={14} />
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    if (showDeleteConfirm) {
        return (
            <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-foreground-muted">Delete this comment?</span>
                <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                    {isLoading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isLoading}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-background-secondary text-foreground rounded-lg hover:bg-opacity-80"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-full hover:bg-background transition-colors text-foreground-muted hover:text-foreground"
            >
                <MoreHorizontal size={16} />
            </button>

            {showMenu && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-lg shadow-lg min-w-[140px] overflow-hidden">
                        <button
                            onClick={() => {
                                setIsEditing(true);
                                setShowMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-background transition-colors text-left text-sm"
                        >
                            <Pencil size={14} className="text-foreground-muted" />
                            <span>Edit</span>
                        </button>
                        <button
                            onClick={() => {
                                setShowDeleteConfirm(true);
                                setShowMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-background transition-colors text-left text-sm text-red-500"
                        >
                            <Trash2 size={14} />
                            <span>Delete</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
