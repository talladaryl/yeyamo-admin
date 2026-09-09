"use client";

import { useQuery } from "@tanstack/react-query";
import { PostCard } from "@/features/feed/components/post-card";
import type { FeedItem, FeedErrorPayload } from "@/features/feed/types";
import { Button, ErrorState, Skeleton } from "@/components/public/ui";
import { Comments } from "@/features/social/components/comments";

export function PostDetail({ id }: { id: string }) {
  const query = useQuery({ queryKey: ["public", "post", id], queryFn: async () => { const response = await fetch(`/api/public/posts/${id}`, { cache: "no-store" }); if (!response.ok) { const payload = await response.json() as FeedErrorPayload; throw new Error(payload.message); } return response.json() as Promise<FeedItem>; }, retry: false });
  if (query.isPending) return <div className="yy-post-skeleton"><Skeleton /></div>;
  if (query.isError) return <div className="yy-feed-status"><ErrorState title="Publication indisponible" message={query.error.message} /><Button type="button" onClick={() => void query.refetch()}>Réessayer</Button></div>;
  return <><PostCard item={query.data} /><Comments postId={id} /></>;
}
