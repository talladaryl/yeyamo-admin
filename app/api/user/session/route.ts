import { NextRequest, NextResponse } from "next/server";
import { userBackendFetch } from "@/lib/user-auth/backend";
import { clearUserSessionCookies, setUserSessionCookies, userAccessToken } from "@/lib/user-auth/cookies";
import { refreshUserSession } from "@/lib/user-auth/refresh";
import { mapUserSession } from "@/lib/user-auth/session";
import { noStore } from "@/lib/user-auth/route-utils";
import type { UserAuthUser } from "@/lib/user-auth/types";

export async function GET(request: NextRequest) {
  const upstream = await userBackendFetch(request, "/api/v1/auth/me", { authenticated: true }).catch(() => undefined);
  if (!upstream && userAccessToken(request)) {
    return noStore(NextResponse.json({ code: "AUTH_ERROR", message: "Le service d’authentification est momentanément indisponible.", retryable: true }, { status: 503 }));
  }
  if (upstream?.ok) return noStore(NextResponse.json(mapUserSession(await upstream.json() as UserAuthUser)));
  if (upstream?.status === 401) {
    try {
      const auth = await refreshUserSession(request);
      const response = NextResponse.json(mapUserSession(auth.user));
      setUserSessionCookies(response, auth);
      return noStore(response);
    } catch {}
  }
  const response = NextResponse.json({ authenticated: false });
  if (upstream?.status === 401) clearUserSessionCookies(response);
  return noStore(response);
}
