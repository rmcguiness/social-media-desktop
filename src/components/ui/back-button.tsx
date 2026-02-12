'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

type BackButtonProps = {
    href?: string;
    label?: string;
};

export const BackButton = ({ href = '/home', label = 'Back' }: BackButtonProps) => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleBack = () => {
        router.push(href);
        
        // Restore scroll position after navigation
        if (mounted) {
            setTimeout(() => {
                const savedPosition = sessionStorage.getItem('homeScrollPosition');
                if (savedPosition) {
                    window.scrollTo(0, parseInt(savedPosition, 10));
                    sessionStorage.removeItem('homeScrollPosition');
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
