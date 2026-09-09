import { timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import { USER_CSRF_COOKIE, setUserCsrfCookie } from "@/lib/user-auth/cookies";

export function createCsrfToken() {
  return crypto.randomUUID().replaceAll("-", "") + crypto.randomUUID().replaceAll("-", "");
}

function safelyEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function validateUserMutation(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (!origin || !host || origin !== `${forwardedProto}://${host}`) return false;
  if (fetchSite === "cross-site") return false;
  const cookieToken = request.cookies.get(USER_CSRF_COOKIE)?.value;
  const headerToken = request.headers.get("x-csrf-token");
  return Boolean(cookieToken && headerToken && safelyEqual(cookieToken, headerToken));
}

export function rotateCsrf(response: NextResponse) {
  const token = createCsrfToken();
  setUserCsrfCookie(response, token);
  return token;
}
