'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type PostLinkWrapperProps = {
    postId: number;
    children: ReactNode;
};

export const PostLinkWrapper = ({ postId, children }: PostLinkWrapperProps) => {
    const router = useRouter();
    const pathname = usePathname();
    
    const handleClick = (e: React.MouseEvent) => {
        // Don't navigate if clicking on a link, button, or interactive element
        const target = e.target as HTMLElement;
        if (
            target.closest('a') || 
            target.closest('button') || 
            target.closest('input') ||
            target.closest('textarea')
        ) {
            return;
        }

        // Save current scroll position and referrer page before navigating
        sessionStorage.setItem('postReferrerScroll', window.scrollY.toString());
        sessionStorage.setItem('postReferrerPath', pathname);
        
        // Navigate to post detail
        router.push(`/posts/${postId}`);
    };

    return (
        <div 
            className="block cursor-pointer"
            onClick={handleClick}
        >
            {children}
        </div>
    );
};
