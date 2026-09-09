import { NextRequest, NextResponse } from "next/server";
import { mapPublicSearchPage } from "@/features/explorer/mapper";
import { publicBackendFetch } from "@/lib/public/backend";

function pageParam(value: string | null, fallback: number, min: number, max: number) { const parsed = Number(value ?? fallback); return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : null; }

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const page = pageParam(request.nextUrl.searchParams.get("page"), 0, 0, Number.MAX_SAFE_INTEGER);
  const size = pageParam(request.nextUrl.searchParams.get("size"), 20, 1, 50);
  if (query.length < 2 || query.length > 120 || page === null || size === null) return NextResponse.json({ code: "INVALID_SEARCH_QUERY", message: "La recherche doit contenir entre 2 et 120 caractères.", retryable: false }, { status: 400 });
  const params = new URLSearchParams({ q: query, page: String(page), size: String(size) });
  for (const key of ["type", "categoryCode", "regionCode"] as const) { const value = request.nextUrl.searchParams.get(key)?.trim(); if (value) params.set(key, value.slice(0, 120)); }
  const correlationId = request.headers.get("x-correlation-id") ?? crypto.randomUUID();
  try {
    const upstream = await publicBackendFetch(request, "/api/v1/public/search", `?${params.toString()}`);
    if (!upstream.ok) return NextResponse.json({ code: "SEARCH_UPSTREAM_ERROR", message: "La recherche est momentanément indisponible.", correlationId, retryable: upstream.status >= 500 }, { status: upstream.status });
    return NextResponse.json(mapPublicSearchPage(await upstream.json()), { headers: { "Cache-Control": "public, s-maxage=30", "X-Correlation-Id": correlationId } });
  } catch { return NextResponse.json({ code: "MALFORMED_SEARCH_RESPONSE", message: "La réponse de recherche est invalide.", correlationId, retryable: false }, { status: 502 }); }
}
