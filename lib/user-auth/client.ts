import type { UserAuthErrorPayload, UserSessionView } from "@/lib/user-auth/types";

export class UserAuthError extends Error {
  constructor(public readonly status: number, public readonly payload: UserAuthErrorPayload) {
    super(payload.message);
  }
}

let csrfPromise: Promise<string> | undefined;
let refreshPromise: Promise<boolean> | undefined;

async function csrfToken() {
  if (!csrfPromise) {
    csrfPromise = fetch("/api/user/csrf", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("CSRF_UNAVAILABLE");
        return (await response.json() as { csrfToken: string }).csrfToken;
      })
      .finally(() => { csrfPromise = undefined; });
  }
  return csrfPromise;
}

async function refresh() {
  if (!refreshPromise) {
    refreshPromise = csrfToken()
      .then((token) => fetch("/api/user/auth/refresh", { method: "POST", headers: { "X-CSRF-Token": token }, cache: "no-store" }))
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => { refreshPromise = undefined; });
  }
  return refreshPromise;
}

export async function userAuthFetch<T>(path: string, init: RequestInit = {}, retried = false): Promise<T> {
  const unsafe = !["GET", "HEAD"].includes((init.method ?? "GET").toUpperCase());
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  if (unsafe) headers.set("X-CSRF-Token", await csrfToken());
  const response = await fetch(path, { ...init, headers, cache: "no-store" });
  if (response.status === 401 && !retried && !path.includes("/auth/") && await refresh()) {
    return userAuthFetch<T>(path, init, true);
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ code: "AUTH_ERROR", message: "Une erreur est survenue.", retryable: false }));
    throw new UserAuthError(response.status, payload as UserAuthErrorPayload);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function getUserSession() {
  return userAuthFetch<UserSessionView>("/api/user/session");
}
