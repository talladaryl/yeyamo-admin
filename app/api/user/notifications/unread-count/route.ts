import { NextRequest, NextResponse } from "next/server";
import { userBackendFetch } from "@/lib/user-auth/backend";
import { noStore } from "@/lib/user-auth/route-utils";
export async function GET(request: NextRequest) { const upstream = await userBackendFetch(request, "/api/v1/notifications/unread/count", { authenticated: true }).catch(() => undefined); if (!upstream || !upstream.ok) return noStore(NextResponse.json({ count: 0 }, { status: upstream?.status === 401 ? 401 : 503 })); return noStore(NextResponse.json(await upstream.json())); }
