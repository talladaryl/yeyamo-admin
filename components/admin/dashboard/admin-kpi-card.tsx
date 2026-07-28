import { MoreVertical, type LucideIcon } from "lucide-react";

import { AdminIconBox } from "@/components/admin/ui/admin-icon-box";
import { AdminStatTrend } from "@/components/admin/ui/admin-stat-trend";
import { cn } from "@/lib/utils";

function sparklinePath(values: number[]) {
  const width = 96;
  const height = 32;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function AdminKpiCard({
  icon: Icon,
  label,
  value,
  change,
  positive,
  sparkline
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  positive: boolean;
  sparkline: number[];
}) {
  const path = sparklinePath(sparkline);

  return (
    <article className="admin-kpi-card">
      <div className="admin-kpi-card__header">
        <AdminIconBox>
          <Icon size={18} strokeWidth={2.1} aria-hidden="true" />
        </AdminIconBox>
        <button type="button" className="admin-kpi-card__menu" aria-label={`Options pour ${label}`}>
          <MoreVertical size={16} />
        </button>
      </div>

      <p className="admin-kpi-card__label">{label}</p>
      <p className="admin-kpi-card__value">{value}</p>
      <AdminStatTrend change={change} positive={positive} />

      <svg className="admin-kpi-card__sparkline" viewBox="0 0 96 32" aria-hidden="true">
        <path d={`${path} L 96 32 L 0 32 Z`} className="admin-kpi-card__sparkline-fill" />
        <path d={path} className="admin-kpi-card__sparkline-line" />
      </svg>
    </article>
  );
}
