'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

type BackButtonProps = {
    fallbackHref?: string;
    label?: string;
};

export const BackButton = ({ fallbackHref = '/home', label = 'Back' }: BackButtonProps) => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleBack = () => {
        // Get saved referrer path or use fallback
        const referrerPath = sessionStorage.getItem('postReferrerPath') || fallbackHref;
        
        router.push(referrerPath);
        
        // Restore scroll position after navigation
        if (mounted) {
            setTimeout(() => {
                const savedPosition = sessionStorage.getItem('postReferrerScroll');
                if (savedPosition) {
                    window.scrollTo(0, parseInt(savedPosition, 10));
                    // Clean up
                    sessionStorage.removeItem('postReferrerScroll');
                    sessionStorage.removeItem('postReferrerPath');
                }
            }, 100);
        }
    };

    return (
        <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-background border border-border transition-colors text-foreground-muted hover:text-foreground"
        >
            <ArrowLeft size={18} />
            <span className="font-medium">{label}</span>
        </button>
    );
};
