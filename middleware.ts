import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    const headers = new Headers(request.headers);
    headers.set("x-yeyamo-lang", request.nextUrl.searchParams.get("lang") === "en" ? "en" : "fr");
    return NextResponse.next({ request: { headers } });
  }
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  if (!request.cookies.has("yeyamo_admin_access") && !request.cookies.has("yeyamo_admin_refresh")) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/", "/about", "/feed", "/documentation", "/confidentialite", "/fonctionnalites", "/solutions", "/profils", "/destinations", "/communaute", "/securite", "/application", "/a-propos", "/faq", "/telechargement", "/admin/:path*"] };
