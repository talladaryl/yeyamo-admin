import { describe, expect, it } from "vitest";
import { mapArtisan, mapArtworkDetail, mapArtworkPage } from "@/features/culture-market/mapper";
const artisanId = "11111111-1111-4111-8111-111111111111";
const artworkId = "22222222-2222-4222-8222-222222222222";
const mediaId = "33333333-3333-4333-8333-333333333333";
const summary = { id: artworkId, artisanId, title: "Masque", slug: "masque", shortDescription: null, countryCode: "CM", cityId: null, culturalCommunity: null, yearCreated: null, editionType: "UNIQUE", availabilityStatus: "DISPLAY_ONLY", authenticityStatus: "DECLARED", createdAt: "2026-09-09T08:00:00Z" };
describe("culture market mappers", () => {
  it("accepts only verified public artisan projections", () => { const input = { id: artisanId, displayName: "Amina", story: "Histoire", craftDescription: "Sculpture", yearsOfExperience: 4, countryCode: "CM", adminLevel1Id: null, cityId: null, localityId: null, languages: ["fr-CM"], specialties: [], acceptsCustomOrders: true, internationalShipping: false, verified: true }; expect(mapArtisan(input).displayName).toBe("Amina"); expect(() => mapArtisan({ ...input, verified: false })).toThrow(); expect((mapArtisan(input) as unknown as Record<string, unknown>).partnerId).toBeUndefined(); });
  it("maps bounded pages and canonical BFF media URLs", () => { expect(mapArtworkPage({ content: [summary], number: 0, size: 20, totalPages: 1, totalElements: 1, last: true }).items).toHaveLength(1); const detail = mapArtworkDetail({ ...summary, story: null, adminLevel1Id: null, localityId: null, cultureContentId: null, productionTime: null, width: null, height: null, depth: null, weight: null, editionSize: null, updatedAt: "2026-09-09T08:00:00Z", media: [{ id: mediaId, type: "PRIMARY_IMAGE", displayOrder: 0, contentUrl: `/api/v1/media/${mediaId}/content` }] }); expect(detail.media[0].url).toBe(`/api/public/media/${mediaId}`); });
});
