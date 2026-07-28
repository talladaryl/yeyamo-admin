import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function AdminIconBox({
  children,
  tone = "primary"
}: {
  children: ReactNode;
  tone?: "primary" | "success" | "warning" | "info";
}) {
  return <span className={cn("admin-icon-box", `tone-${tone}`)}>{children}</span>;
}
