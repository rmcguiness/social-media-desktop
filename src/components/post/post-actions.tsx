'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postsService } from '@/services/posts.service';
import { getAuthToken } from '@/app/actions/auth';
import { revalidateHomeFeed, revalidatePostPage } from '@/app/actions/posts';
import { Edit2, Trash2, X, Check } from 'lucide-react';
import type { Post } from '@/types/post-type';

interface PostActionsProps {
    post: Post;
    currentUserId?: number;
}

export default function PostActions({ post, currentUserId }: PostActionsProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editData, setEditData] = useState({
        title: post.title,
        content: post.content,
        image: post.image || '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Only show actions if current user owns the post
    if (!currentUserId || currentUserId !== post.user.id) {
        return null;
    }

    const handleEdit = async () => {
        setError('');
        setLoading(true);

        try {
            const token = await getAuthToken();
            if (!token) {
                router.push('/login');
                return;
            }

            await postsService.update(
                post.id,
                {
                    title: editData.title,
                    content: editData.content,
                    image: editData.image || undefined,
                },
                token
            );

            setIsEditing(false);
            
            // Revalidate caches to show updated post
            await revalidateHomeFeed();
            await revalidatePostPage(post.id);
            
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update post');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setError('');
        setLoading(true);

        try {
            const token = await getAuthToken();
            if (!token) {
                router.push('/login');
                return;
            }

            await postsService.delete(post.id, token);
            
            // Revalidate home feed cache to remove deleted post
            await revalidateHomeFeed();
            
            // Redirect to home after deletion
            router.push('/home');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete post');
        } finally {
            setLoading(false);
        }
    };

    if (isEditing) {
        return (
            <div className="mt-4 p-4 border-t border-border">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    <div>
                        <input
                            type="text"
                            value={editData.title}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            className="input-field w-full font-semibold"
                            placeholder="Post title"
                            maxLength={200}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <textarea
                            value={editData.content}
                            onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                            className="input-field w-full resize-none"
                            placeholder="Post content"
                            rows={4}
                            maxLength={2000}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <input
                            type="url"
                            value={editData.image}
                            onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                            className="input-field w-full"
                            placeholder="Image URL (optional)"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                    <button
                        onClick={handleEdit}
                        disabled={loading || !editData.title.trim() || !editData.content.trim()}
                        className="btn-primary px-4 py-2 flex items-center gap-2 disabled:opacity-50"
                    >
                        <Check size={18} />
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setError('');
                            setEditData({
                                title: post.title,
                                content: post.content,
                                image: post.image || '',
                            });
                        }}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-background hover:bg-opacity-50 transition-colors flex items-center gap-2"
                    >
                        <X size={18} />
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    if (isDeleting) {
        return (
            <div className="mt-4 p-4 border-t border-border">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <p className="text-sm mb-4">Are you sure you want to delete this post? This action cannot be undone.</p>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Trash2 size={18} />
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                    <button
                        onClick={() => {
                            setIsDeleting(false);
                            setError('');
                        }}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-background hover:bg-opacity-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
            <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-2 rounded-lg hover:bg-background transition-colors flex items-center gap-2 text-sm text-foreground-muted hover:text-accent"
            >
                <Edit2 size={16} />
                Edit
            </button>
            <button
                onClick={() => setIsDeleting(true)}
                className="px-3 py-2 rounded-lg hover:bg-background transition-colors flex items-center gap-2 text-sm text-foreground-muted hover:text-red-500"
            >
                <Trash2 size={16} />
                Delete
            </button>
        </div>
    );
}
