import type { NextRequest } from "next/server";
import { backendBaseUrl } from "@/lib/server/backend";

export async function publicBackendFetch(request: NextRequest, path: string, search = "") {
  if (!path.startsWith("/api/v1/") || path.includes("://")) throw new Error("PUBLIC_BACKEND_PATH_FORBIDDEN");
  const correlationId = request.headers.get("x-correlation-id") ?? crypto.randomUUID();
  return fetch(`${backendBaseUrl()}${path}${search}`, {
    headers: { Accept: "application/json", "X-Correlation-Id": correlationId },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000)
  });
}
