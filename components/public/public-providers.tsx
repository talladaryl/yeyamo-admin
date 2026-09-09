"use client";

import type { ReactNode } from "react";
import { UserSessionProvider } from "@/features/user-auth/user-session-context";
import { ProtectedActionProvider } from "@/features/user-auth/protected-action-context";

export function PublicProviders({ children }: { children: ReactNode }) {
  return <UserSessionProvider><ProtectedActionProvider>{children}</ProtectedActionProvider></UserSessionProvider>;
}
