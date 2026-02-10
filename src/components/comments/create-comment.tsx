'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { commentsService } from '@/services/comments.service';
import { getAuthToken } from '@/app/actions/auth';
import { Send } from 'lucide-react';

interface CreateCommentProps {
    postId: number;
}

export default function CreateComment({ postId }: CreateCommentProps) {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!content.trim()) return;
        
        setError('');
        setLoading(true);

        try {
            const token = await getAuthToken();
            if (!token) {
                router.push('/login');
                return;
            }

            await commentsService.create(postId, { content: content.trim() }, token);

            // Reset form
            setContent('');
            
            // Refresh page to show new comment
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to post comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border-t border-border pt-4 mt-4">
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a comment..."
                    maxLength={1000}
                    className="input-field flex-1"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Send size={18} />
                    {loading ? 'Posting...' : 'Post'}
                </button>
            </form>
            
            <div className="flex justify-between text-xs text-foreground-muted mt-2">
                <span>Maximum 1000 characters</span>
                <span>{content.length}/1000</span>
            </div>
        </div>
    );
}
