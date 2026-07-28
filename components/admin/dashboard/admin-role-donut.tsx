"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import type { AdminRoleSlice } from "@/lib/types";

export function AdminRoleDonut({ data, total }: { data: AdminRoleSlice[]; total: string }) {
  return (
    <div className="admin-chart-card admin-chart-card--donut">
      <h3 className="admin-section-card__title">Répartition par rôle</h3>

      <div className="admin-donut">
        <div className="admin-donut__chart">
          <ResponsiveContainer width="100%" height={228}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={68}
                outerRadius={92}
                paddingAngle={4}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="admin-donut__center">
            <strong>{total}</strong>
            <span>Total</span>
          </div>
        </div>

        <div className="admin-donut__legend">
          {data.map((item) => (
            <div key={item.label} className="admin-donut__legend-item">
              <span className="admin-donut__legend-dot" style={{ backgroundColor: item.color }} />
              <span className="admin-donut__legend-label">{item.label}</span>
              <span className="admin-donut__legend-value">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
