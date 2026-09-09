import { NextRequest, NextResponse } from "next/server";
import { publicBackendFetch } from "@/lib/public/backend";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuidPattern.test(id)) return NextResponse.json({ code: "MEDIA_NOT_FOUND", message: "Média introuvable." }, { status: 404 });
  try {
    const upstream = await publicBackendFetch(request, `/api/v1/media/${id}/content`);
    if (!upstream.ok) return NextResponse.json({ code: "MEDIA_UNAVAILABLE", message: "Média indisponible." }, { status: upstream.status });
    const headers = new Headers();
    for (const name of ["content-type", "content-length", "cache-control", "etag", "last-modified"]) { const value = upstream.headers.get(name); if (value) headers.set(name, value); }
    return new NextResponse(upstream.body, { status: 200, headers });
  } catch { return NextResponse.json({ code: "MEDIA_UNAVAILABLE", message: "Média indisponible." }, { status: 502 }); }
}
