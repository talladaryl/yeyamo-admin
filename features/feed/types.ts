export type BackendFeedItemDto = {
  postId: string;
  authorId: string;
  caption: string | null;
  mediaIds: string[];
  hashtags: string[];
  publishedAt: string;
  likes: number;
  comments: number;
  shares: number;
  referenceType: string | null;
  referenceId: string | null;
};

export type BackendFeedPageDto = { page: number; size: number; hasNext: boolean; items: BackendFeedItemDto[]; generatedAt: string };
export type BackendPostDto = { id: string; authorId: string; caption: string | null; catalogAssetId: string | null; mediaIds: string[]; hashtags: string[]; createdAt: string; publishedAt: string | null };
export type BackendInteractionSummaryDto = { likes: number; comments: number; shares: number; likedByViewer: boolean; favoriteByViewer: boolean };
export type FeedItem = {
  id: string;
  authorId: string;
  caption: string | null;
  mediaIds: string[];
  hashtags: string[];
  publishedAt: string;
  stats: { likes: number; comments: number; shares: number };
  referenceType: string | null;
  referenceId: string | null;
};
export type FeedPage = { page: number; size: number; items: FeedItem[]; hasNext: boolean; generatedAt: string };
export type FeedErrorPayload = { code: string; message: string; correlationId?: string; retryable: boolean };
