'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

type UserProfileLinkProps = {
    username: string;
    children: ReactNode;
    className?: string;
};

/**
 * Client component wrapper for profile links that need stopPropagation
 * to prevent triggering parent click handlers (like post navigation)
 */
export const UserProfileLink = ({ username, children, className }: UserProfileLinkProps) => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <Link 
            href={`/profile/${username}`}
            onClick={handleClick}
            className={className}
        >
            {children}
        </Link>
    );
};
