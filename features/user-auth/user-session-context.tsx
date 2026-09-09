"use client";

import { createContext, useCallback, useContext, useEffect, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserSession, userAuthFetch } from "@/lib/user-auth/client";
import type { UserSessionView } from "@/lib/user-auth/types";

type UserSessionContextValue = {
  status: "loading" | "anonymous" | "authenticated";
  session: UserSessionView | undefined;
  refreshSession: () => Promise<unknown>;
  logout: () => Promise<void>;
};

const key = ["user-session"] as const;
const UserSessionContext = createContext<UserSessionContextValue | undefined>(undefined);

function broadcast(type: "login" | "logout" | "session-changed") {
  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel("yeyamo-user-auth");
  channel.postMessage({ type });
  channel.close();
}

export function UserSessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: key, queryFn: getUserSession, staleTime: 30_000, retry: false });
  const refreshSession = useCallback(() => query.refetch(), [query]);
  const logout = useCallback(async () => {
    await userAuthFetch<{ success: true }>("/api/user/auth/logout", { method: "POST" }).catch(() => undefined);
    queryClient.setQueryData<UserSessionView>(key, { authenticated: false });
    queryClient.removeQueries({ predicate: ({ queryKey }) => queryKey[0] === "user" || queryKey[0] === "partner" });
    broadcast("logout");
  }, [queryClient]);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel("yeyamo-user-auth");
    channel.onmessage = () => queryClient.invalidateQueries({ queryKey: key });
    return () => channel.close();
  }, [queryClient]);

  const status = query.isLoading ? "loading" : query.data?.authenticated ? "authenticated" : "anonymous";
  return <UserSessionContext.Provider value={{ status, session: query.data, refreshSession, logout }}>{children}</UserSessionContext.Provider>;
}

export function useUserSession() {
  const value = useContext(UserSessionContext);
  if (!value) throw new Error("useUserSession doit être utilisé dans UserSessionProvider");
  return value;
}

export function notifyUserAuthChanged(type: "login" | "session-changed" = "session-changed") {
  broadcast(type);
}
