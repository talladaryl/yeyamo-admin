import type { NextRequest, NextResponse } from "next/server";

import type { AuthResponse } from "@/lib/api/types";

export const ACCESS_COOKIE = "yeyamo_admin_access";
export const REFRESH_COOKIE = "yeyamo_admin_refresh";
export const USER_COOKIE = "yeyamo_admin_user";

export const backendBaseUrl = () => (process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8083").replace(/\/$/, "");

export const privilegedRoles = new Set(["SUPER_ADMIN", "ADMIN", "MODERATOR", "EDITOR", "SUPPORT", "COMMERCIAL"]);

export function setSessionCookies(response: NextResponse, auth: AuthResponse) {
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set(ACCESS_COOKIE, auth.accessToken, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: auth.expiresIn });
  response.cookies.set(REFRESH_COOKIE, auth.refreshToken, { httpOnly: true, secure, sameSite: "strict", path: "/", maxAge: 60 * 60 * 24 * 30 });
  response.cookies.set(USER_COOKIE, JSON.stringify({ id: auth.user.id, email: auth.user.email, roles: auth.user.roles, permissions: auth.user.permissions, scopes: auth.user.scopes }), { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export function clearSessionCookies(response: NextResponse) {
  [ACCESS_COOKIE, REFRESH_COOKIE, USER_COOKIE].forEach((name) => response.cookies.set(name, "", { httpOnly: true, path: "/", maxAge: 0 }));
}

export function accessToken(request: NextRequest) {
  return request.cookies.get(ACCESS_COOKIE)?.value;
}
