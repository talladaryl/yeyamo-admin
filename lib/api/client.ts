import type { ApiErrorPayload } from "@/lib/api/types";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly correlationId?: string,
    public readonly details?: unknown
  ) {
    super(message);
  }
}
 
let refreshPromise: Promise<boolean> | undefined;

async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh", { method: "POST", cache: "no-store" })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => { refreshPromise = undefined; });
  }
  return refreshPromise;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}, retried = false): Promise<T> {
  const response = await fetch(`/api/backend${path}`, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers
    },
    cache: "no-store"
  });

  if (response.status === 401 && !retried && await refreshSession()) {
    return apiFetch<T>(path, init, true);
  }

  if (response.status === 401 && typeof window !== "undefined") {
    window.location.assign(`/admin/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;
    throw new ApiError(
      response.status,
      payload.code ?? `HTTP_${response.status}`,
      payload.message ?? "La requête vers YeYamo a échoué.",
      payload.correlationId,
      payload.details
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function jsonRequest(method: string, body?: unknown, headers?: HeadersInit): RequestInit {
  return { method, body: body === undefined ? undefined : JSON.stringify(body), headers };
}
