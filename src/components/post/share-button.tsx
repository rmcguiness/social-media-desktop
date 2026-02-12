'use client';

import { useState } from 'react';
import { Share, Check, Copy, Link2 } from 'lucide-react';

interface ShareButtonProps {
    postId: number;
    shares: number;
}

export function ShareButton({ postId, shares }: ShareButtonProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const postUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/posts/${postId}`
        : `/posts/${postId}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(postUrl);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
                setShowMenu(false);
            }, 1500);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out this post',
                    url: postUrl,
                });
                setShowMenu(false);
            } catch (err) {
                // User cancelled or error
                if ((err as Error).name !== 'AbortError') {
                    console.error('Share failed:', err);
                }
            }
        } else {
            // Fallback to copy
            handleCopyLink();
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background text-foreground-muted hover:text-accent transition-colors"
            >
                <Share size={18} />
                <span className="text-sm font-medium">{shares}</span>
            </button>

            {showMenu && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowMenu(false)}
                    />
                    
                    {/* Menu */}
                    <div className="absolute bottom-full right-0 mb-2 z-20 bg-card border border-border rounded-lg shadow-lg min-w-[180px] overflow-hidden">
                        <button
                            onClick={handleCopyLink}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors text-left"
                        >
                            {copied ? (
                                <>
                                    <Check size={18} className="text-green-500" />
                                    <span className="text-sm text-green-500 font-medium">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Link2 size={18} className="text-foreground-muted" />
                                    <span className="text-sm text-foreground">Copy link</span>
                                </>
                            )}
                        </button>
                        
                        {typeof navigator !== 'undefined' && navigator.share && (
                            <button
                                onClick={handleNativeShare}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors text-left border-t border-border"
                            >
                                <Share size={18} className="text-foreground-muted" />
                                <span className="text-sm text-foreground">Share via...</span>
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
