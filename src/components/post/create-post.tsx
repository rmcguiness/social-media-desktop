'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postsService } from '@/services/posts.service';
import { getAuthToken } from '@/app/actions/auth';
import { revalidateHomeFeed } from '@/app/actions/posts';
import { Card } from '@/components';
import { Image as ImageIcon, X } from 'lucide-react';

interface CreatePostProps {
    onSuccess?: () => void;
}

export default function CreatePost({ onSuccess }: CreatePostProps) {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = await getAuthToken();
            if (!token) {
                router.push('/login');
                return;
            }

            await postsService.create(
                {
                    title: formData.title,
                    content: formData.content,
                    image: formData.image || undefined,
                },
                token
            );

            // Reset form
            setFormData({ title: '', content: '', image: '' });
            setIsExpanded(false);
            
            // Revalidate home feed cache to show new post
            await revalidateHomeFeed();
            
            // Refresh page to show new post
            router.refresh();
            
            // Call success callback if provided
            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({ title: '', content: '', image: '' });
        setError('');
        setIsExpanded(false);
    };

    return (
        <Card className="mb-6">
            <div className="p-4 md:p-5">
                {!isExpanded ? (
                    // Collapsed state - just a prompt
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="w-full text-left px-4 py-3 rounded-lg bg-background hover:bg-opacity-50 text-foreground-muted transition-all duration-200 border border-border"
                    >
                        What's on your mind?
                    </button>
                ) : (
                    // Expanded state - full form
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Post title..."
                                required
                                maxLength={200}
                                className="input-field w-full text-lg font-semibold"
                                autoFocus
                            />
                        </div>

                        <div className="space-y-2">
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="What do you want to share?"
                                required
                                maxLength={2000}
                                rows={4}
                                className="input-field w-full resize-none"
                            />
                            <div className="flex justify-between text-xs text-foreground-muted">
                                <span>Maximum 2000 characters</span>
                                <span>{formData.content.length}/2000</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <ImageIcon size={18} className="text-foreground-muted" />
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="Image URL (optional)"
                                    className="input-field flex-1"
                                />
                            </div>
                        </div>

                        {formData.image && (
                            <div className="relative rounded-lg overflow-hidden border border-border">
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-48 object-cover"
                                    onError={() => setFormData(prev => ({ ...prev, image: '' }))}
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-foreground hover:text-foreground-muted transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !formData.title.trim() || !formData.content.trim()}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Card>
    );
}
