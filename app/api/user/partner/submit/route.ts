import { NextRequest, NextResponse } from "next/server";
import { mapPartnerProfile } from "@/features/partner-portal/mapper";
import { userBackendFetch } from "@/lib/user-auth/backend";
import { noStore, rejectInvalidMutation } from "@/lib/user-auth/route-utils";
export async function POST(request: NextRequest) { const invalid = rejectInvalidMutation(request); if (invalid) return invalid; const upstream = await userBackendFetch(request, "/api/v1/partners/me/submit", { method: "POST", authenticated: true }).catch(() => undefined); if (!upstream) return noStore(NextResponse.json({ code: "PARTNER_UNAVAILABLE", message: "Soumission indisponible.", retryable: true }, { status: 503 })); if (!upstream.ok) return noStore(new NextResponse(upstream.body, { status: upstream.status, headers: { "Content-Type": "application/json", "Cache-Control": "private, no-store" } })); return noStore(NextResponse.json(mapPartnerProfile(await upstream.json()))); }
