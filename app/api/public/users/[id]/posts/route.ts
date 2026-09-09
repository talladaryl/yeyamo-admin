import { NextRequest, NextResponse } from "next/server";
import { mapFeedPage } from "@/features/feed/mapper";
import { publicBackendFetch } from "@/lib/public/backend";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const page = Number(request.nextUrl.searchParams.get("page") ?? "0"); const size = Number(request.nextUrl.searchParams.get("size") ?? "20"); const correlationId = request.headers.get("x-correlation-id") ?? crypto.randomUUID();
  if (!uuid.test(id) || !Number.isInteger(page) || page < 0 || !Number.isInteger(size) || size < 1 || size > 50) return NextResponse.json({ code: "INVALID_PROFILE_POSTS_QUERY", message: "Requête invalide.", retryable: false }, { status: 400 });
  try {
    const upstream = await publicBackendFetch(request, `/api/v1/public/feed/users/${id}/posts`, `?page=${page}&size=${size}`);
    if (!upstream.ok) return NextResponse.json({ code: "PROFILE_POSTS_UPSTREAM_ERROR", message: "Les publications sont momentanément indisponibles.", correlationId, retryable: upstream.status >= 500 }, { status: upstream.status });
    return NextResponse.json(mapFeedPage(await upstream.json()), { headers: { "Cache-Control": "public, s-maxage=30", "X-Correlation-Id": correlationId } });
  } catch { return NextResponse.json({ code: "MALFORMED_PROFILE_POSTS_RESPONSE", message: "Les publications reçues sont invalides.", correlationId, retryable: false }, { status: 502 }); }
}
