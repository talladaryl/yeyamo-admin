import { NextRequest, NextResponse } from "next/server";
import type { AuthResponse } from "@/lib/api/types";
import { REFRESH_COOKIE, backendBaseUrl, clearSessionCookies, privilegedRoles, setSessionCookies } from "@/lib/server/backend";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return NextResponse.json({ code: "SESSION_EXPIRED", message: "Session expirée." }, { status: 401 });
  const upstream = await fetch(`${backendBaseUrl()}/api/v1/auth/refresh`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ refreshToken }), cache: "no-store" }).catch(() => undefined);
  if (!upstream?.ok) { const response = NextResponse.json({ code: "SESSION_EXPIRED", message: "La session ne peut pas être renouvelée." }, { status: 401 }); clearSessionCookies(response); return response; }
  const auth = await upstream.json() as AuthResponse;
  if (!auth.user.roles.some((role) => privilegedRoles.has(role))) { const response = NextResponse.json({ code: "ADMIN_ACCESS_REQUIRED", message: "Accès administrateur requis." }, { status: 403 }); clearSessionCookies(response); return response; }
  const response = NextResponse.json({ user: auth.user }); setSessionCookies(response, auth); return response;
}
