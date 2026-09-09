"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import { Spinner } from "@/components/public/ui";
import { useUserSession } from "@/features/user-auth/user-session-context";
import { validateNextPath } from "@/lib/user-auth/next-path";

export function UserGuard({ children }: { children: ReactNode }) {
  const { status } = useUserSession();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (status === "anonymous") {
      const target = validateNextPath(typeof window === "undefined" ? pathname : `${pathname}${window.location.search}`);
      router.replace(`/login?next=${encodeURIComponent(target)}` as Route);
    }
  }, [pathname, router, status]);
  if (status !== "authenticated") return <div className="yy-guard-loading"><Spinner label="Vérification de la session" /></div>;
  return children;
}
