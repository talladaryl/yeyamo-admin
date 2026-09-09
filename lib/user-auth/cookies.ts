import type { NextRequest, NextResponse } from "next/server";
import type { UserAuthResponse } from "@/lib/user-auth/types";

export const USER_ACCESS_COOKIE = "yeyamo_user_access";
export const USER_REFRESH_COOKIE = "yeyamo_user_refresh";
export const USER_CSRF_COOKIE = "yeyamo_user_csrf";

const secure = process.env.NODE_ENV === "production";
const refreshMaxAge = Number(process.env.USER_REFRESH_COOKIE_MAX_AGE ?? 60 * 60 * 24 * 30);

export function setUserSessionCookies(response: NextResponse, auth: UserAuthResponse) {
  response.cookies.set(USER_ACCESS_COOKIE, auth.accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: auth.expiresIn
  });
  response.cookies.set(USER_REFRESH_COOKIE, auth.refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/api/user",
    maxAge: refreshMaxAge
  });
}

export function setUserCsrfCookie(response: NextResponse, token: string) {
  response.cookies.set(USER_CSRF_COOKIE, token, {
    httpOnly: false,
    secure,
    sameSite: "strict",
    path: "/api/user",
    maxAge: 60 * 60 * 2
  });
}

export function clearUserSessionCookies(response: NextResponse) {
  response.cookies.set(USER_ACCESS_COOKIE, "", { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 0 });
  response.cookies.set(USER_REFRESH_COOKIE, "", { httpOnly: true, secure, sameSite: "strict", path: "/api/user", maxAge: 0 });
  response.cookies.set(USER_CSRF_COOKIE, "", { httpOnly: false, secure, sameSite: "strict", path: "/api/user", maxAge: 0 });
}

export function userAccessToken(request: NextRequest) {
  return request.cookies.get(USER_ACCESS_COOKIE)?.value;
}

export function userRefreshToken(request: NextRequest) {
  return request.cookies.get(USER_REFRESH_COOKIE)?.value;
}
