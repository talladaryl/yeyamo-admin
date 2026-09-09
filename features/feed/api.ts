import type { FeedErrorPayload, FeedPage } from "@/features/feed/types";

export class FeedApiError extends Error {
  constructor(public readonly status: number, public readonly payload: FeedErrorPayload) { super(payload.message); }
}
export async function getFeedPage(page: number, size = 20) {
  const response = await fetch(`/api/public/feed?page=${page}&size=${size}`, { cache: "no-store" });
  if (!response.ok) throw new FeedApiError(response.status, await response.json() as FeedErrorPayload);
  return response.json() as Promise<FeedPage>;
}
