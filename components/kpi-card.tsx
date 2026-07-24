import { formatCompactNumber } from "@/lib/utils";

export function KpiCard({
  title,
  value,
  change
}: {
  title: string;
  value: number;
  change?: number | null;
}) {
  const positive = (change ?? 0) >= 0;

  return (
    <article className="admin-panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="max-w-[14rem] text-sm font-medium text-slate-600">{title}</p>
        <span className="rounded-2xl bg-rose-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700">
          KPI
        </span>
      </div>
      <div className="mt-5 flex items-end justify-between gap-3">
        <p className="text-[34px] font-semibold tracking-tight text-slate-950">{formatCompactNumber(value)}</p>
        {typeof change === "number" ? (
          <span
            className={`rounded-full border px-2.5 py-1 text-sm font-semibold ${
              positive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {positive ? "+" : ""}
            {change.toFixed(1)}%
          </span>
        ) : null}
      </div>
      <div className="mt-4 h-1 rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${positive ? "bg-emerald-500" : "bg-rose-500"}`}
          style={{ width: `${Math.min(Math.abs(change ?? 0) * 7, 100)}%` }}
        />
      </div>
    </article>
  );
}
