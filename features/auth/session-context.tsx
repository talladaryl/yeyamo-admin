"use client";
import { createContext, ReactNode, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AdminSession } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/query-keys";

type SessionContextValue = { session: AdminSession | null; loading: boolean; refetch: () => Promise<unknown> };
const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const query = useQuery({ queryKey: queryKeys.session.current, queryFn: async () => { const response = await fetch("/api/auth/session", { cache: "no-store" }); if (response.status === 401) return null; if (!response.ok) throw new Error("Impossible de charger la session administrateur."); return response.json() as Promise<AdminSession>; }, staleTime: 60_000 });
  return <SessionContext.Provider value={{ session: query.data ?? null, loading: query.isLoading, refetch: query.refetch }}>{children}</SessionContext.Provider>;
}

export function useAdminSession() { const value = useContext(SessionContext); if (!value) throw new Error("useAdminSession doit être utilisé dans SessionProvider"); return value; }
