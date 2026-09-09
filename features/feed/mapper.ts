import { z } from "zod";
import type { BackendFeedItemDto, BackendFeedPageDto, BackendInteractionSummaryDto, BackendPostDto, FeedItem, FeedPage } from "@/features/feed/types";

const uuid = z.string().uuid();
const itemSchema = z.object({
  postId: uuid,
  authorId: z.string().min(1).max(100),
  caption: z.string().nullable(),
  mediaIds: z.array(uuid),
  hashtags: z.array(z.string()),
  publishedAt: z.string().datetime({ offset: true }),
  likes: z.number().int().nonnegative(), comments: z.number().int().nonnegative(), shares: z.number().int().nonnegative(),
  referenceType: z.string().nullable(),
  referenceId: z.string().nullable()
});
export const feedPageSchema = z.object({ page: z.number().int().nonnegative(), size: z.number().int().min(1).max(50), hasNext: z.boolean(), items: z.array(itemSchema), generatedAt: z.string().datetime({ offset: true }) });
const postSchema = z.object({ id: uuid, authorId: z.string().min(1).max(100), caption: z.string().nullable(), catalogAssetId: uuid.nullable(), mediaIds: z.array(uuid), hashtags: z.array(z.string()), createdAt: z.string().datetime({ offset: true }), publishedAt: z.string().datetime({ offset: true }).nullable() });
const summarySchema = z.object({ likes: z.number().int().nonnegative(), comments: z.number().int().nonnegative(), shares: z.number().int().nonnegative(), likedByViewer: z.boolean(), favoriteByViewer: z.boolean() });

export function mapFeedItem(item: BackendFeedItemDto): FeedItem {
  return { id: item.postId, authorId: item.authorId, caption: item.caption, mediaIds: item.mediaIds, hashtags: item.hashtags, publishedAt: item.publishedAt, stats: { likes: item.likes, comments: item.comments, shares: item.shares }, referenceType: item.referenceType, referenceId: item.referenceId };
}

export function mapFeedPage(input: unknown): FeedPage {
  const dto = feedPageSchema.parse(input) as BackendFeedPageDto;
  const seen = new Set<string>();
  const items = dto.items.filter((item) => !seen.has(item.postId) && Boolean(seen.add(item.postId))).map(mapFeedItem);
  return { page: dto.page, size: dto.size, items, hasNext: dto.hasNext, generatedAt: dto.generatedAt };
}

export function mergeFeedPages(pages: FeedPage[]) {
  const items = new Map<string, FeedItem>();
  for (const page of pages) for (const item of page.items) if (!items.has(item.id)) items.set(item.id, item);
  return [...items.values()];
}

export function mapPostDetail(postInput: unknown, summaryInput: unknown) {
  const post = postSchema.parse(postInput) as BackendPostDto;
  const summary = summarySchema.parse(summaryInput) as BackendInteractionSummaryDto;
  return mapFeedItem({ postId: post.id, authorId: post.authorId, caption: post.caption, mediaIds: post.mediaIds, hashtags: post.hashtags, publishedAt: post.publishedAt ?? post.createdAt, likes: summary.likes, comments: summary.comments, shares: summary.shares, referenceType: null, referenceId: null });
}
