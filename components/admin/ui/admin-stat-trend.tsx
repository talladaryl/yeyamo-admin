import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function AdminStatTrend({
  change,
  positive
}: {
  change: string;
  positive: boolean;
}) {
  const Icon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <span className={cn("admin-stat-trend", positive ? "is-positive" : "is-negative")}>
      <Icon size={16} aria-hidden="true" />
      <span>{change}</span>
    </span>
  );
}
