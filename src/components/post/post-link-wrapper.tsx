'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

type PostLinkWrapperProps = {
    postId: number;
    children: ReactNode;
};

export const PostLinkWrapper = ({ postId, children }: PostLinkWrapperProps) => {
    const handleClick = () => {
        // Save current scroll position before navigating
        sessionStorage.setItem('homeScrollPosition', window.scrollY.toString());
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
