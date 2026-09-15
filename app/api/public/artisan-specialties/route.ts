import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { publicBackendFetch } from "@/lib/public/backend";
const schema = z.array(z.object({ id: z.string().uuid(), code: z.string(), name: z.string().min(1), description: z.string().nullable() }));
export async function GET(request: NextRequest) { try { const upstream = await publicBackendFetch(request, "/api/v1/artisan-specialties"); if (!upstream.ok) return NextResponse.json({ code: "SPECIALTIES_UPSTREAM_ERROR", message: "Les spécialités sont indisponibles.", retryable: upstream.status >= 500 }, { status: upstream.status }); return NextResponse.json(schema.parse(await upstream.json()), { headers: { "Cache-Control": "public, s-maxage=300" } }); } catch { return NextResponse.json({ code: "MALFORMED_SPECIALTIES_RESPONSE", message: "Les spécialités reçues sont invalides.", retryable: false }, { status: 502 }); } }
