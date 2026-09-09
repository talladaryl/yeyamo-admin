import { describe, expect, it } from "vitest";
import { mapCollectionPage, mapNotifications, notificationHref } from "@/features/engagement/mapper";
const id = "11111111-1111-4111-8111-111111111111";
describe("Engagement mapping", () => {
  it("maps private collection pages", () => { const page = mapCollectionPage({ content: [{ id, title: "Lieux", description: null, isPublic: false, createdAt: "2026-09-09T08:00:00Z", updatedAt: "2026-09-09T08:00:00Z", items: [{ assetId: id }] }], number: 0, size: 20, totalElements: 1, totalPages: 1, last: true }); expect(page.items[0].placeCount).toBe(1); });
  it("maps unknown notification types safely and validates deep links", () => { const item = mapNotifications({ items: [{ id, eventType: "UNKNOWN_EVENT", title: "Info", body: "Texte", dataJson: '{"targetType":"post","targetId":"11111111-1111-4111-8111-111111111111"}', createdAt: "2026-09-09T08:00:00Z", readAt: null }] }).items[0]; expect(notificationHref(item)).toBe(`/posts/${id}`); expect(notificationHref({ ...item, data: { actionUrl: "https://evil.test" } })).toBeNull(); });
});
