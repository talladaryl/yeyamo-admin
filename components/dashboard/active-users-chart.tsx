"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { label: "01 Mai", value: 50000 },
  { label: "04 Mai", value: 74000 },
  { label: "06 Mai", value: 69000 },
  { label: "09 Mai", value: 101000 },
  { label: "12 Mai", value: 90000 },
  { label: "15 Mai", value: 95000 },
  { label: "18 Mai", value: 91000 },
  { label: "20 Mai", value: 108000 },
  { label: "22 Mai", value: 112000 },
  { label: "24 Mai", value: 101000 },
  { label: "26 Mai", value: 121000 },
  { label: "28 Mai", value: 149000 },
  { label: "31 Mai", value: 142000 }
];

export function ActiveUsersChart() {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="activeUsersFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.24} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#f5d8d8" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} tick={{ fill: "#6b7280" }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tick={{ fill: "#6b7280" }}
            ticks={[0, 50000, 100000, 150000]}
            tickFormatter={(value) => (value === 0 ? "0" : `${value / 1000}K`)}
          />
          <Tooltip formatter={(value) => Number(value ?? 0).toLocaleString("fr-FR")} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#activeUsersFill)"
            dot={{ r: 3, fill: "#ef4444", strokeWidth: 0 }}
            activeDot={{ r: 4, fill: "#dc2626", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
