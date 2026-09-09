import { NextRequest, NextResponse } from "next/server";
import { userBackendFetch } from "@/lib/user-auth/backend";
import { noStore, rejectInvalidMutation } from "@/lib/user-auth/route-utils";
export async function POST(request: NextRequest) { const rejected = rejectInvalidMutation(request); if (rejected) return rejected; const upstream = await userBackendFetch(request, "/api/v1/notifications/read-all", { method: "POST", authenticated: true }).catch(() => undefined); if (!upstream || !upstream.ok) return noStore(NextResponse.json({ code: "NOTIFICATIONS_ERROR", message: "Les notifications n’ont pas pu être mises à jour.", retryable: true }, { status: upstream?.status ?? 503 })); return noStore(new NextResponse(null, { status: 204 })); }
