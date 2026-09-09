import { describe, expect, it } from "vitest";
import { isValidCoordinate, mapCategories, mapEventDetail, mapPlaceDetail, mapPlaceSummary, toMapMarkers } from "@/features/explorer/mapper";
import { normalizeExplorerQuery, serializeExplorerQuery } from "@/features/explorer/query";

const placeId = "11111111-1111-4111-8111-111111111111";
const eventId = "22222222-2222-4222-8222-222222222222";
const place = { id: placeId, name: "Musée", slug: "musee", latitude: 4.0511, longitude: 9.7679, address: "Douala", status: "PUBLISHED", categoryName: "Culture", distanceKm: 0 };

describe("Explorer mapping", () => {
  it("keeps genuine zero distances and strips category internals", () => { expect(mapPlaceSummary(place).distanceKm).toBe(0); expect(mapCategories([{ id: 4, name: "Culture", slug: "culture", icon: null, active: true, children: [{ id: 5 }] }, { id: 6, name: "Inactive", slug: "inactive", icon: null, active: false }])).toEqual([{ id: 4, name: "Culture", slug: "culture", icon: null }]); });
  it("maps public place details without accepting malformed schedules", () => { const detail = mapPlaceDetail({ ...place, description: null, phone: null, website: null, media: [], schedules: [{ id: 1, dayOfWeek: 1, openTime: "09:00", closeTime: "18:00" }] }); expect(detail.schedules[0].id).toBe(1); expect(() => mapPlaceDetail({ ...place, description: null, phone: null, website: null, media: [], schedules: [{ id: 1, dayOfWeek: 9, openTime: "09:00", closeTime: "18:00" }] })).toThrow(); });
  it("maps a complete event and validates map coordinates", () => { expect(mapEventDetail({ id: eventId, placeId, title: "Festival", description: null, startAt: "2026-09-09T08:00:00Z", endAt: "2026-09-09T10:00:00Z", status: "PUBLISHED", capacity: null, registeredCount: 0, coverMediaId: null }).registeredCount).toBe(0); expect(isValidCoordinate(4.05, 9.76)).toBe(true); expect(isValidCoordinate(0, 0)).toBe(false); expect(toMapMarkers([{ ...place, latitude: 0, longitude: 0 }, place])).toHaveLength(1); });
  it("normalizes and serializes safe URL state", () => { const state = normalizeExplorerQuery(new URLSearchParams("q=%00%20test%20&mode=map&radius=15")); expect(state).toEqual({ q: "test", mode: "map", radiusKm: 15 }); expect(serializeExplorerQuery(state).toString()).toBe("q=test&mode=map&radius=15"); });
});
