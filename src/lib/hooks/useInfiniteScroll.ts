'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions<T> {
    initialData: T[];
    initialCursor: number | null;
    fetchMore: (cursor: number) => Promise<{ data: T[]; nextCursor: number | null }>;
    threshold?: number; // pixels from bottom to trigger load
}

interface UseInfiniteScrollResult<T> {
    data: T[];
    isLoading: boolean;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    sentinelRef: (node: HTMLDivElement | null) => void;
}

export function useInfiniteScroll<T>({
    initialData,
    initialCursor,
    fetchMore,
    threshold = 200,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
    const [data, setData] = useState<T[]>(initialData);
    const [cursor, setCursor] = useState<number | null>(initialCursor);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialCursor !== null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore || cursor === null) return;

        setIsLoading(true);
        try {
            const result = await fetchMore(cursor);
            setData((prev) => [...prev, ...result.data]);
            setCursor(result.nextCursor);
            setHasMore(result.nextCursor !== null);
        } catch (error) {
            console.error('Error loading more data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [cursor, fetchMore, hasMore, isLoading]);

    // Intersection Observer for sentinel element
    const sentinelRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isLoading) return;

            if (observerRef.current) {
                observerRef.current.disconnect();
            }

            if (node && hasMore) {
                observerRef.current = new IntersectionObserver(
                    (entries) => {
                        if (entries[0].isIntersecting) {
                            loadMore();
                        }
                    },
                    { rootMargin: `${threshold}px` }
                );
                observerRef.current.observe(node);
            }
        },
        [hasMore, isLoading, loadMore, threshold]
    );

    // Cleanup observer on unmount
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    // Update data when initialData changes
    useEffect(() => {
        setData(initialData);
        setCursor(initialCursor);
        setHasMore(initialCursor !== null);
    }, [initialData, initialCursor]);

    return {
        data,
        isLoading,
        hasMore,
        loadMore,
        sentinelRef,
    };
}
