import { cookies } from "next/headers";
import { backendBaseUrl } from "@/lib/server/backend";
import { USER_ACCESS_COOKIE } from "@/lib/user-auth/cookies";
import { mapUserSession } from "@/lib/user-auth/session";
import type { UserAuthUser } from "@/lib/user-auth/types";

export async function getServerUserSession() {
  const token = (await cookies()).get(USER_ACCESS_COOKIE)?.value;
  if (!token) return null;
  const response = await fetch(`${backendBaseUrl()}/api/v1/auth/me`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(8_000) }).catch(() => undefined);
  if (!response?.ok) return null;
  return mapUserSession(await response.json() as UserAuthUser);
}
