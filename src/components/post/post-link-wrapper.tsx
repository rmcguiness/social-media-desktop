'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type PostLinkWrapperProps = {
    postId: number;
    children: ReactNode;
};

export const PostLinkWrapper = ({ postId, children }: PostLinkWrapperProps) => {
    const pathname = usePathname();
    
    const handleClick = () => {
        // Save current scroll position and referrer page before navigating
        sessionStorage.setItem('postReferrerScroll', window.scrollY.toString());
        sessionStorage.setItem('postReferrerPath', pathname);
    };

    return (
        <Link 
            href={`/posts/${postId}`} 
            className="block"
            onClick={handleClick}
        >
            {children}
        </Link>
    );
};
