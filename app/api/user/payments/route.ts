import { NextRequest, NextResponse } from "next/server";
import { mapPayments } from "@/features/payments/mapper";
import { userBackendFetch } from "@/lib/user-auth/backend";
import { noStore, upstreamError } from "@/lib/user-auth/route-utils";
export async function GET(request: NextRequest) { const upstream = await userBackendFetch(request, "/api/v1/payments/mine", { authenticated: true }).catch(() => undefined); if (!upstream) return noStore(NextResponse.json({ code: "PAYMENTS_UNAVAILABLE", message: "Les paiements sont indisponibles.", retryable: true }, { status: 503 })); if (!upstream.ok) return noStore(await upstreamError(upstream)); try { return noStore(NextResponse.json(mapPayments(await upstream.json()))); } catch { return noStore(NextResponse.json({ code: "MALFORMED_PAYMENTS_RESPONSE", message: "Les paiements reçus sont invalides.", retryable: false }, { status: 502 })); } }
