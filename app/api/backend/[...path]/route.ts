import { NextRequest, NextResponse } from "next/server";

import { accessToken, backendBaseUrl } from "@/lib/server/backend";

const allowedPrefixes = ["api/v1/admin/", "api/v1/auth/sessions", "api/v1/analytics/", "api/v1/moderation/", "api/v1/trust/", "api/v1/catalog/", "api/v1/collections", "api/v1/mission-management/", "api/v1/missions", "api/v1/me/", "api/v1/commerce/", "api/v1/payments/", "api/v1/bookings/", "api/v1/booking-management/", "api/v1/events", "api/v1/tickets", "api/v1/notifications", "api/v1/places", "api/v1/regions", "api/v1/cities", "api/v1/districts", "api/v1/categories", "api/v1/maps/"];

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const token = accessToken(request);
  if (!token) return NextResponse.json({ code: "UNAUTHENTICATED", message: "Session administrateur requise." }, { status: 401 });

  const path = (await context.params).path.join("/");
  if (!allowedPrefixes.some((prefix) => path === prefix || path.startsWith(prefix))) {
    return NextResponse.json({ code: "PROXY_PATH_FORBIDDEN", message: "Cette route n’est pas exposée par le proxy administrateur." }, { status: 403 });
  }

  const headers = new Headers({ Authorization: `Bearer ${token}`, Accept: "application/json" });
  const contentType = request.headers.get("content-type");
  const idempotencyKey = request.headers.get("idempotency-key");
  const correlationId = request.headers.get("x-correlation-id") ?? crypto.randomUUID();
  if (contentType) headers.set("Content-Type", contentType);
  if (idempotencyKey) headers.set("Idempotency-Key", idempotencyKey);
  headers.set("X-Correlation-Id", correlationId);
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer();
  let upstream: Response;
  try {
    upstream = await fetch(`${backendBaseUrl()}/${path}${request.nextUrl.search}`, { method: request.method, headers, body, cache: "no-store" });
  } catch {
    return NextResponse.json({ code: "BACKEND_UNAVAILABLE", message: "La Gateway YeYamo est indisponible.", correlationId }, { status: 503 });
  }
  const responseHeaders = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) responseHeaders.set("Content-Type", upstreamType);
  responseHeaders.set("X-Correlation-Id", upstream.headers.get("x-correlation-id") ?? correlationId);
  return new NextResponse(upstream.body, { status: upstream.status, headers: responseHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
