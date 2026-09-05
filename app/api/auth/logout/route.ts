import { NextRequest, NextResponse } from "next/server";

import { accessToken, backendBaseUrl, clearSessionCookies } from "@/lib/server/backend";

export async function POST(request: NextRequest) {
  const token = accessToken(request);
  if (token) {
    await fetch(`${backendBaseUrl()}/api/v1/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }).catch(() => undefined);
  }
  const response = NextResponse.json({ success: true });
  clearSessionCookies(response);
  return response;
}
