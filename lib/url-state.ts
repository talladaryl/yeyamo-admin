"use client";
import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export type AdminUrlState = { page: number; size: number; search: string; status?: string; role?: string; region?: string; city?: string; category?: string; sort?: string; from?: string; to?: string };
export function useAdminUrlState() {
  const pathname = usePathname(); const router = useRouter(); const params = useSearchParams(); const serialized = params.toString();
  const state = useMemo<AdminUrlState>(() => { const current = new URLSearchParams(serialized); return { page: Math.max(0, Number(current.get("page") ?? 0) || 0), size: Math.max(1, Number(current.get("size") ?? 20) || 20), search: current.get("search") ?? "", status: current.get("status") ?? undefined, role: current.get("role") ?? undefined, region: current.get("region") ?? undefined, city: current.get("city") ?? undefined, category: current.get("category") ?? undefined, sort: current.get("sort") ?? undefined, from: current.get("from") ?? undefined, to: current.get("to") ?? undefined }; }, [serialized]);
  const update = useCallback((patch: Partial<Record<keyof AdminUrlState, string | number | undefined>>) => { const next = new URLSearchParams(serialized); Object.entries(patch).forEach(([key, value]) => value === undefined || value === "" ? next.delete(key) : next.set(key, String(value))); const query = next.toString(); router.replace((query ? `${pathname}?${query}` : pathname) as never, { scroll: false }); }, [pathname, router, serialized]);
  const reset = useCallback(() => router.replace(pathname as never, { scroll: false }), [pathname, router]);
  return { state, update, reset };
}
