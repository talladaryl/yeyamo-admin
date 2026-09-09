import { NextRequest, NextResponse } from "next/server";
import { mapPlacePage } from "@/features/explorer/mapper";
import { publicBackendFetch } from "@/lib/public/backend";

function integer(value: string | null, fallback: number, min: number, max: number) { const parsed = Number(value ?? fallback); return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : null; }

export async function GET(request: NextRequest) {
  const page = integer(request.nextUrl.searchParams.get("page"), 0, 0, Number.MAX_SAFE_INTEGER);
  const size = integer(request.nextUrl.searchParams.get("size"), 20, 1, 50);
  const correlationId = request.headers.get("x-correlation-id") ?? crypto.randomUUID();
  if (page === null || size === null) return NextResponse.json({ code: "INVALID_PLACE_QUERY", message: "Pagination invalide.", retryable: false }, { status: 400 });
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  for (const key of ["categoryId", "regionId", "cityId"] as const) { const value = request.nextUrl.searchParams.get(key); if (value && /^\d+$/.test(value)) params.set(key, value); }
  try {
    const upstream = await publicBackendFetch(request, "/api/v1/places", `?${params.toString()}`);
    if (!upstream.ok) return NextResponse.json({ code: "PLACES_UPSTREAM_ERROR", message: "Les lieux sont momentanément indisponibles.", correlationId, retryable: upstream.status >= 500 }, { status: upstream.status });
    return NextResponse.json(mapPlacePage(await upstream.json()), { headers: { "Cache-Control": "public, s-maxage=30", "X-Correlation-Id": correlationId } });
  } catch { return NextResponse.json({ code: "MALFORMED_PLACES_RESPONSE", message: "Les lieux reçus sont invalides.", correlationId, retryable: false }, { status: 502 }); }
}
