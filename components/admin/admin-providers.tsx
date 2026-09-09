"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/admin/ui/admin-toast";
import { SessionProvider } from "@/features/auth/session-context";

export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <SessionProvider>{children}</SessionProvider>
    </ToastProvider>
  );
}
