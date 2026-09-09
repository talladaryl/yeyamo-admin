import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/admin/login") return NextResponse.next();
  if (pathname.startsWith("/admin") && !request.cookies.has("yeyamo_admin_access") && !request.cookies.has("yeyamo_admin_refresh")) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }
  if (["/me", "/messages", "/create"].some((route) => pathname === route || pathname.startsWith(`${route}/`)) && !request.cookies.has("yeyamo_user_access") && !request.cookies.has("yeyamo_user_refresh")) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/me/:path*", "/messages/:path*", "/create/:path*"] };
