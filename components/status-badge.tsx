import { statusClasses } from "@/lib/constants";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
        statusClasses[status] ?? "bg-slate-100 text-slate-700"
      )}
    >
      {status}
    </span>
  );
}
