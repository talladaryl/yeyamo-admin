"use client";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/client";

export function createQueryClient() {
  const notify = (error: unknown) => window.dispatchEvent(new CustomEvent("yeyamo:api-error", { detail: error }));
  return new QueryClient({ queryCache: new QueryCache({ onError: notify }), mutationCache: new MutationCache({ onError: notify }), defaultOptions: { queries: { staleTime: 30_000, gcTime: 5 * 60_000, refetchOnWindowFocus: false, retry: (count, error) => error instanceof ApiError && [401, 403, 404].includes(error.status) ? false : count < 2 }, mutations: { retry: false } } });
}
