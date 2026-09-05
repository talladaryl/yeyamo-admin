"use client";
import { ReactNode, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "@/features/auth/session-context";
import { createQueryClient } from "@/lib/query/query-client";
import { ToastProvider } from "@/components/admin/ui/admin-toast";

export function AppProviders({ children }: { children: ReactNode }) { const [queryClient] = useState(createQueryClient); return <QueryClientProvider client={queryClient}><ToastProvider><SessionProvider>{children}</SessionProvider></ToastProvider></QueryClientProvider>; }
