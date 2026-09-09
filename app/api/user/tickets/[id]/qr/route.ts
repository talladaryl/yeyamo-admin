import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { userBackendFetch } from "@/lib/user-auth/backend";
import { noStore, upstreamError } from "@/lib/user-auth/route-utils";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const schema = z.object({ ticketId: z.string().uuid(), serialNumber: z.string(), eventId: z.string().min(1), status: z.string(), qrToken: z.string().min(1) });
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; if (!uuid.test(id)) return noStore(NextResponse.json({ code: "TICKET_NOT_FOUND", message: "Billet introuvable.", retryable: false }, { status: 404 })); const upstream = await userBackendFetch(request, `/api/v1/tickets/${id}/qr`, { authenticated: true }).catch(() => undefined); if (!upstream) return noStore(NextResponse.json({ code: "TICKET_QR_UNAVAILABLE", message: "Le QR du billet est indisponible.", retryable: true }, { status: 503 })); if (!upstream.ok) return noStore(await upstreamError(upstream)); try { return noStore(NextResponse.json(schema.parse(await upstream.json()))); } catch { return noStore(NextResponse.json({ code: "MALFORMED_TICKET_QR_RESPONSE", message: "Le QR reçu est invalide.", retryable: false }, { status: 502 })); } }
