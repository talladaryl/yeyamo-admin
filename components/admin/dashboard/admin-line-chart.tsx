"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type { AdminChartPoint } from "@/lib/types";

function ChartTooltip({
  active,
  payload,
  label
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="admin-chart-tooltip">
      <p className="admin-chart-tooltip__label">{label}</p>
      <p className="admin-chart-tooltip__value">{Number(payload[0]?.value ?? 0).toLocaleString("fr-FR")}</p>
    </div>
  );
}

export function AdminLineChart({ data }: { data: AdminChartPoint[] }) {
  return (
    <div className="admin-chart-card">
      <div className="admin-section-card__head">
        <h3 className="admin-section-card__title">Évolution des utilisateurs</h3>
        <button type="button" className="admin-section-card__pill">
          7 derniers jours
        </button>
      </div>

      <div className="admin-chart-card__body">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
            <defs>
              <linearGradient id="adminUsersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E30613" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#E30613" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#EAECF0" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#667085", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#667085", fontSize: 12 }} width={36} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#E30613", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#E30613"
              strokeWidth={3}
              fill="url(#adminUsersGradient)"
              dot={{ r: 4, fill: "#E30613", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
