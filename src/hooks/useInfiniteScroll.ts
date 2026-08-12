import { useState, useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll<T>(
  allItems: T[],
  itemsPerPage: number = 8
): {
  visibleItems: T[];
  hasMore: boolean;
  loadMore: () => void;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  reset: () => void;
} {
  const [page, setPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const visibleItems = allItems.slice(0, page * itemsPerPage);
  const hasMore = visibleItems.length < allItems.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore]);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  // Reset page when items change (filters applied)
  useEffect(() => {
    setPage(1);
  }, [allItems.length]);

  return { visibleItems, hasMore, loadMore, sentinelRef, reset };
}
