import { NextResponse } from "next/server";

import type { AuthResponse } from "@/lib/api/types";
import { backendBaseUrl, privilegedRoles, setSessionCookies } from "@/lib/server/backend";

export async function POST(request: Request) {
  const body = await request.json();
  const backendResponse = await fetch(`${backendBaseUrl()}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store"
  });
  const payload = await backendResponse.json().catch(() => ({}));

  if (!backendResponse.ok) return NextResponse.json(payload, { status: backendResponse.status });

  const auth = payload as AuthResponse;
  if (!auth.user.roles.some((role) => privilegedRoles.has(role))) {
    return NextResponse.json({ code: "ADMIN_ACCESS_REQUIRED", message: "Ce compte ne possède aucun rôle d’administration." }, { status: 403 });
  }

  const response = NextResponse.json({ user: auth.user });
  setSessionCookies(response, auth);
  return response;
}
