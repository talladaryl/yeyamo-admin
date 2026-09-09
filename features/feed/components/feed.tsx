"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { getFeedPage, FeedApiError } from "@/features/feed/api";
import { mergeFeedPages } from "@/features/feed/mapper";
import { PostCard } from "@/features/feed/components/post-card";
import { Button, EmptyState, ErrorState, Skeleton } from "@/components/public/ui";

export function Feed() {
  const marker = useRef<HTMLDivElement>(null);
  const query = useInfiniteQuery({ queryKey: ["public", "feed"], queryFn: ({ pageParam }) => getFeedPage(pageParam), initialPageParam: 0, getNextPageParam: (last) => last.hasNext ? last.page + 1 : undefined, retry: (count, error) => error instanceof FeedApiError && !error.payload.retryable ? false : count < 2 });
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = query;
  useEffect(() => { const node = marker.current; if (!node || !hasNextPage) return; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !isFetchingNextPage) void fetchNextPage(); }, { rootMargin: "300px" }); observer.observe(node); return () => observer.disconnect(); }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  if (query.isPending) return <div className="yy-feed-list" aria-label="Chargement du Feed">{[1,2,3].map((value) => <div className="yy-post-skeleton" key={value}><Skeleton /></div>)}</div>;
  if (query.isError) { const blocker = query.error instanceof FeedApiError && query.error.payload.code === "BLOCKED_PUBLIC_FEED_API"; return <div className="yy-feed-status"><ErrorState title={blocker ? "Feed public en attente de l’API" : "Impossible de charger le Feed"} message={query.error.message} /><Button type="button" onClick={() => void query.refetch()}><RefreshCw aria-hidden="true" />Réessayer</Button></div>; }
  const items = mergeFeedPages(query.data.pages);
  if (!items.length) return <EmptyState title="Aucune publication disponible pour le moment" message="Revenez bientôt pour découvrir les nouveautés Yeyamo." />;
  return <div className="yy-feed-list">{items.map((item) => <PostCard key={item.id} item={item} />)}<div ref={marker} className="yy-feed-more">{query.isFetchingNextPage ? <Skeleton /> : query.hasNextPage ? <Button type="button" onClick={() => void query.fetchNextPage()}>Charger plus</Button> : <p>Vous avez atteint la fin.</p>}</div></div>;
}
