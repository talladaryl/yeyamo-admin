import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { backendBaseUrl } from "@/lib/server/backend";
import { userRefreshToken } from "@/lib/user-auth/cookies";
import type { UserAuthResponse } from "@/lib/user-auth/types";

const refreshes = new Map<string, Promise<UserAuthResponse>>();

export function refreshUserSession(request: NextRequest) {
  const refreshToken = userRefreshToken(request);
  if (!refreshToken) return Promise.reject(new Error("INVALID_REFRESH_TOKEN"));
  const key = createHash("sha256").update(refreshToken).digest("hex");
  const current = refreshes.get(key);
  if (current) return current;
  const refresh = fetch(`${backendBaseUrl()}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000)
  }).then(async (response) => {
    if (!response.ok) throw new Error("INVALID_REFRESH_TOKEN");
    return response.json() as Promise<UserAuthResponse>;
  }).finally(() => refreshes.delete(key));
  refreshes.set(key, refresh);
  return refresh;
}

export const refreshLockScope = "MULTI_INSTANCE_REFRESH_LOCK_REQUIRED" as const;
