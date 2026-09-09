import { z } from "zod";
import type { Category, EventDetail, EventSummary, MapMarker, PlaceDetail, PlaceSummary } from "@/features/explorer/types";
import type { PlacePage, PublicSearchPage } from "@/features/explorer/types";

const uuid = z.string().uuid();
const coordinate = z.number().finite();
const placeSummarySchema = z.object({ id: uuid, name: z.string().min(1), slug: z.string().nullable().optional(), latitude: coordinate.nullable(), longitude: coordinate.nullable(), address: z.string().nullable(), status: z.string(), categoryName: z.string().nullable(), distanceKm: z.number().finite().nullable() });
const placeDetailSchema = placeSummarySchema.extend({ description: z.string().nullable(), phone: z.string().nullable(), website: z.string().nullable(), media: z.array(z.object({ id: z.number().int(), url: z.string(), type: z.string(), displayOrder: z.number().int().nullable() })), schedules: z.array(z.object({ id: z.number().int(), dayOfWeek: z.number().int().min(1).max(7), openTime: z.string(), closeTime: z.string() })) });
const eventSummarySchema = z.object({ id: uuid, placeId: uuid, title: z.string().min(1), startAt: z.string().datetime({ offset: true }), endAt: z.string().datetime({ offset: true }), status: z.string(), capacity: z.number().int().nullable(), registeredCount: z.number().int().nonnegative() });
const eventDetailSchema = eventSummarySchema.extend({ description: z.string().nullable(), coverMediaId: uuid.nullable() });
const categorySchema = z.object({ id: z.number().int(), name: z.string().min(1), slug: z.string().min(1), icon: z.string().nullable(), children: z.array(z.unknown()).optional(), active: z.boolean() });

export function isValidCoordinate(latitude: number | null, longitude: number | null) { return latitude !== null && longitude !== null && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180 && !(latitude === 0 && longitude === 0); }
export function mapPlaceSummary(input: unknown): PlaceSummary { const value = placeSummarySchema.parse(input); return { ...value, slug: value.slug ?? null }; }
export function mapPlaceDetail(input: unknown): PlaceDetail { const value = placeDetailSchema.parse(input); return { ...value, slug: value.slug ?? null }; }
export function mapEventSummary(input: unknown): EventSummary { return eventSummarySchema.parse(input); }
export function mapEventDetail(input: unknown): EventDetail { return eventDetailSchema.parse(input); }
export function mapCategories(input: unknown): Category[] { return z.array(categorySchema).parse(input).flatMap((category) => category.active ? [{ id: category.id, name: category.name, slug: category.slug, icon: category.icon }] : []); }
const placePageSchema = z.object({ content: z.array(placeSummarySchema), number: z.number().int().nonnegative(), size: z.number().int().min(1), last: z.boolean() });
const publicSearchPageSchema = z.object({ page: z.number().int().nonnegative(), size: z.number().int().min(1).max(50), hasNext: z.boolean(), items: z.array(z.object({ type: z.string().min(1), id: z.string().min(1), title: z.string().min(1), subtitle: z.string().nullable(), categoryCode: z.string().nullable(), regionCode: z.string().nullable(), city: z.string().nullable() })), generatedAt: z.string().datetime({ offset: true }) });
export function mapPlacePage(input: unknown): PlacePage { const value = placePageSchema.parse(input); return { page: value.number, size: value.size, hasNext: !value.last, items: value.content.map(mapPlaceSummary) }; }
export function mapPublicSearchPage(input: unknown): PublicSearchPage { return publicSearchPageSchema.parse(input); }
export function toMapMarkers(items: PlaceSummary[]): MapMarker[] { return items.filter((item) => isValidCoordinate(item.latitude, item.longitude)).map((item) => ({ id: item.id, name: item.name, latitude: item.latitude, longitude: item.longitude })); }
