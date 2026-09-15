import type { ApiError, Artisan, ArtworkDetail, ArtworkSummary, Page, Specialty } from "@/features/culture-market/types";
export class CultureMarketError extends Error { constructor(public status: number, public payload: ApiError) { super(payload.message); } }
async function get<T>(url: string): Promise<T> { const response = await fetch(url, { cache: "no-store" }); if (!response.ok) throw new CultureMarketError(response.status, await response.json() as ApiError); return response.json() as Promise<T>; }
export const cultureMarketApi = {
  artisans: (query: string) => get<Page<Artisan>>(`/api/public/artisans?${query}`),
  artisan: (id: string) => get<Artisan>(`/api/public/artisans/${id}`),
  specialties: () => get<Specialty[]>("/api/public/artisan-specialties"),
  artworks: (query: string) => get<Page<ArtworkSummary>>(`/api/public/artworks?${query}`),
  artwork: (id: string) => get<ArtworkDetail>(`/api/public/artworks/${id}`)
};
