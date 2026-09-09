import { NextRequest, NextResponse } from "next/server";
import { publicBackendFetch } from "@/lib/public/backend";
import { mapPostDetail } from "@/features/feed/mapper";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const correlationId = request.headers.get("x-correlation-id") ?? crypto.randomUUID();
  if (!uuidPattern.test(id)) return NextResponse.json({ code: "POST_NOT_FOUND", message: "Publication introuvable.", retryable: false }, { status: 404 });
  try {
    const [post, summary] = await Promise.all([publicBackendFetch(request, `/api/v1/posts/${id}`), publicBackendFetch(request, `/api/v1/interactions/posts/${id}/summary`)]);
    if (post.status === 404) return NextResponse.json({ code: "POST_NOT_FOUND", message: "Publication introuvable.", correlationId, retryable: false }, { status: 404 });
    if (!post.ok || !summary.ok) return NextResponse.json({ code: "POST_UPSTREAM_ERROR", message: "La publication est momentanément indisponible.", correlationId, retryable: true }, { status: 502 });
    return NextResponse.json(mapPostDetail(await post.json(), await summary.json()), { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120", "X-Correlation-Id": correlationId } });
  } catch { return NextResponse.json({ code: "MALFORMED_POST_RESPONSE", message: "La publication ne peut pas être affichée.", correlationId, retryable: false }, { status: 502 }); }
}
