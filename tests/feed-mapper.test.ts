import { describe, expect, it } from "vitest";
import { mapFeedItem, mapFeedPage, mapPostDetail, mergeFeedPages } from "@/features/feed/mapper";

const firstId = "11111111-1111-4111-8111-111111111111";
const mediaId = "33333333-3333-4333-8333-333333333333";
const dto = { postId: firstId, authorId: "42", caption: "Bonjour", mediaIds: [mediaId], hashtags: ["Cameroun"], publishedAt: "2026-09-09T08:00:00Z", likes: 0, comments: 2, shares: 1, referenceType: null, referenceId: null };
const page = (items = [dto], hasNext = false) => ({ page: 0, size: 20, hasNext, items, generatedAt: "2026-09-09T08:00:00Z" });

describe("Feed mapping", () => {
  it("preserves public media identifiers without inventing a URL", () => { const item = mapFeedItem(dto); expect(item.stats.likes).toBe(0); expect(item.mediaIds).toEqual([mediaId]); });
  it("uses the backend hasNext value", () => expect(mapFeedPage(page([dto], true)).hasNext).toBe(true));
  it("deduplicates duplicate ids inside and across pages", () => { const mapped = mapFeedPage(page([dto, dto])); expect(mapped.items).toHaveLength(1); expect(mergeFeedPages([mapped, { ...mapped, page: 1 }])).toHaveLength(1); });
  it("rejects malformed counters", () => expect(() => mapFeedPage(page([{ ...dto, likes: undefined } as unknown as typeof dto]))).toThrow());
  it("maps a public post detail with public stats", () => { const item = mapPostDetail({ id: firstId, authorId: "42", caption: null, catalogAssetId: null, mediaIds: [], hashtags: [], createdAt: "2026-09-09T08:00:00Z", publishedAt: null }, { likes: 3, comments: 0, shares: 0, likedByViewer: false, favoriteByViewer: false }); expect(item.publishedAt).toBe("2026-09-09T08:00:00Z"); expect(item.stats.comments).toBe(0); });
});
