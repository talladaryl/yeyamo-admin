import type { Category, EventDetail, EventSummary, PlaceDetail, PlacePage, PlaceSummary, PublicApiError, PublicSearchPage } from "@/features/explorer/types";

export class ExplorerApiError extends Error { constructor(public readonly status: number, public readonly payload: PublicApiError) { super(payload.message); } }
async function get<T>(url: string): Promise<T> { const response = await fetch(url, { cache: "no-store" }); if (!response.ok) throw new ExplorerApiError(response.status, await response.json() as PublicApiError); return response.json() as Promise<T>; }
export const explorerApi = {
  nearby: (latitude: number, longitude: number, radiusKm: number) => get<PlaceSummary[]>(`/api/public/places/nearby?lat=${encodeURIComponent(latitude)}&lng=${encodeURIComponent(longitude)}&radiusKm=${encodeURIComponent(radiusKm)}`),
  places: async (page = 0, size = 20) => (await get<PlacePage>(`/api/public/places?page=${page}&size=${size}`)).items,
  place: (id: string) => get<PlaceDetail>(`/api/public/places/${id}`), categories: () => get<Category[]>("/api/public/categories"), events: () => get<EventSummary[]>("/api/public/events"), event: (id: string) => get<EventDetail>(`/api/public/events/${id}`),
  search: (q: string, page = 0, size = 20) => get<PublicSearchPage>(`/api/public/search?q=${encodeURIComponent(q)}&page=${page}&size=${size}`)
};
