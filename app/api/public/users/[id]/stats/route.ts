import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { publicBackendFetch } from "@/lib/public/backend";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const schema = z.object({ followersCount: z.number().int().nonnegative(), followingCount: z.number().int().nonnegative() });

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const correlationId = request.headers.get("x-correlation-id") ?? crypto.randomUUID();
  if (!uuid.test(id)) return NextResponse.json({ code: "PROFILE_NOT_FOUND", message: "Profil introuvable.", retryable: false }, { status: 404 });
  try {
    const upstream = await publicBackendFetch(request, `/api/v1/users/social/${id}/stats`);
    if (!upstream.ok) return NextResponse.json({ code: "SOCIAL_STATS_UPSTREAM_ERROR", message: "Les compteurs sont momentanément indisponibles.", correlationId, retryable: upstream.status >= 500 }, { status: upstream.status });
    return NextResponse.json(schema.parse(await upstream.json()), { headers: { "Cache-Control": "public, s-maxage=30", "X-Correlation-Id": correlationId } });
  } catch { return NextResponse.json({ code: "MALFORMED_SOCIAL_STATS_RESPONSE", message: "Les compteurs reçus sont invalides.", correlationId, retryable: false }, { status: 502 }); }
}
