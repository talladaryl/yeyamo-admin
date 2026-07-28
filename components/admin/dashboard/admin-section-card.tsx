import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function AdminSectionCard({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn("admin-section-card", className)}>{children}</section>;
}
