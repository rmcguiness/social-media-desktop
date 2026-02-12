"use client";

import { PageTitle } from "@/components";
import { Filter } from "lucide-react";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Home page error:', error);
    }, [error]);

    return (
        <main className="font-sans flex gap-4 min-h-[var(--screen-minus-navbar)] mx-auto px-4 mb-10">
            <div className="flex flex-8/12 flex-col max-w-4xl">
                <PageTitle title="For You Page">
                    <button className="text-sm font-bold text-foreground-muted">
                        <Filter size={24} />
                    </button>
                </PageTitle>
                <div className="flex flex-col gap-4 items-center justify-center py-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
                        <p className="text-foreground-muted mb-4">
                            {error.message || 'Failed to load posts'}
                        </p>
                        <button
                            onClick={reset}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
