import type { NextRequest } from "next/server";
import { backendBaseUrl } from "@/lib/server/backend";
import { userAccessToken } from "@/lib/user-auth/cookies";

type UserBackendOptions = RequestInit & { authenticated?: boolean; timeoutMs?: number };

export async function userBackendFetch(request: NextRequest, path: string, options: UserBackendOptions = {}) {
  if (!path.startsWith("/api/v1/") || path.includes("://")) throw new Error("USER_BACKEND_PATH_FORBIDDEN");
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("X-Correlation-Id", request.headers.get("x-correlation-id") ?? crypto.randomUUID());
  if (options.authenticated) {
    const token = userAccessToken(request);
    if (!token) return new Response(null, { status: 401 });
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(`${backendBaseUrl()}${path}`, {
    ...options,
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(options.timeoutMs ?? 10_000)
  });
}
