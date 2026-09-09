import { NextRequest, NextResponse } from "next/server";
import { mapFeedPage } from "@/features/feed/mapper";
import { publicBackendFetch } from "@/lib/public/backend";

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") ?? "0");
  const size = Number(request.nextUrl.searchParams.get("size") ?? "20");
  if (!Number.isInteger(page) || page < 0 || !Number.isInteger(size) || size < 1 || size > 50) return NextResponse.json({ code: "INVALID_FEED_QUERY", message: "Pagination invalide.", retryable: false }, { status: 400 });
  const correlationId = request.headers.get("x-correlation-id") ?? crypto.randomUUID();
  try {
    const upstream = await publicBackendFetch(request, "/api/v1/public/feed", `?page=${page}&size=${size}`);
    if (!upstream.ok) return NextResponse.json({ code: upstream.status === 429 ? "FEED_RATE_LIMITED" : "FEED_UPSTREAM_ERROR", message: "Le Feed est momentanément indisponible.", correlationId, retryable: upstream.status >= 500 || upstream.status === 429 }, { status: upstream.status, headers: { "Cache-Control": "no-store", "X-Correlation-Id": correlationId } });
    return NextResponse.json(mapFeedPage(await upstream.json()), { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60", "X-Correlation-Id": upstream.headers.get("x-correlation-id") ?? correlationId } });
  } catch (error) {
    const malformed = error instanceof Error && error.name === "ZodError";
    return NextResponse.json({ code: malformed ? "MALFORMED_FEED_RESPONSE" : "FEED_NETWORK_ERROR", message: malformed ? "La réponse Feed est invalide." : "Le Feed ne peut pas être joint.", correlationId, retryable: !malformed }, { status: 502, headers: { "Cache-Control": "no-store", "X-Correlation-Id": correlationId } });
  }
}
