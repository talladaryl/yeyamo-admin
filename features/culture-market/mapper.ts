import { z } from "zod";
import type { Artisan, ArtworkDetail, ArtworkSummary, Page } from "@/features/culture-market/types";

const uuid = z.string().uuid();
const nullableText = z.string().nullable();
const specialty = z.object({ id: uuid, code: z.string(), name: z.string().min(1), description: nullableText });
const artisan = z.object({ id: uuid, displayName: z.string().min(1), story: z.string(), craftDescription: z.string(), yearsOfExperience: z.number().int().nonnegative().nullable(), countryCode: z.string().length(2), adminLevel1Id: nullableText, cityId: nullableText, localityId: nullableText, languages: z.array(z.string()), specialties: z.array(specialty), acceptsCustomOrders: z.boolean(), internationalShipping: z.boolean(), verified: z.literal(true) });
const artworkSummary = z.object({ id: uuid, artisanId: uuid, title: z.string().min(1), slug: z.string().min(1), shortDescription: nullableText, countryCode: z.string().length(2), cityId: nullableText, culturalCommunity: nullableText, yearCreated: z.number().int().nullable(), editionType: z.string(), availabilityStatus: z.string(), authenticityStatus: z.string(), createdAt: z.string().datetime({ offset: true }) });
const artworkDetail = artworkSummary.extend({ story: nullableText, adminLevel1Id: nullableText, localityId: nullableText, cultureContentId: uuid.nullable(), productionTime: nullableText, width: z.number().nullable(), height: z.number().nullable(), depth: z.number().nullable(), weight: z.number().nullable(), editionSize: z.number().int().nullable(), updatedAt: z.string().datetime({ offset: true }), media: z.array(z.object({ id: uuid, type: z.string(), displayOrder: z.number().int(), contentUrl: z.string() })) });
const page = <T extends z.ZodTypeAny>(item: T) => z.object({ content: z.array(item), number: z.number().int().nonnegative(), size: z.number().int().positive(), totalPages: z.number().int().nonnegative(), totalElements: z.number().int().nonnegative(), last: z.boolean() });
function mappedPage<T>(value: z.infer<ReturnType<typeof page>>, items: T[]): Page<T> { return { page: value.number, size: value.size, totalPages: value.totalPages, totalElements: value.totalElements, hasNext: !value.last, items }; }
export function mapArtisan(input: unknown): Artisan { return artisan.parse(input); }
export function mapArtisanPage(input: unknown): Page<Artisan> { const value = page(artisan).parse(input); return mappedPage(value, value.content); }
export function mapArtworkPage(input: unknown): Page<ArtworkSummary> { const value = page(artworkSummary).parse(input); return mappedPage(value, value.content); }
export function mapArtworkDetail(input: unknown): ArtworkDetail { const value = artworkDetail.parse(input); return { ...value, media: value.media.map((media) => ({ id: media.id, type: media.type, displayOrder: media.displayOrder, url: `/api/public/media/${media.id}` })) }; }
