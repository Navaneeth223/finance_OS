"use client";

import { memo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { cashFlow } from "@/lib/finance-data";
import { formatCurrency } from "@/lib/utils";

export const CashFlowChart = memo(function CashFlowChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={cashFlow} margin={{ left: 0, right: 0, top: 12, bottom: 0 }}>
        <defs>
          <linearGradient id="cashFlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.48} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
        <Tooltip
          cursor={{ stroke: "hsl(var(--primary))", strokeDasharray: "4 4" }}
          content={({ active, payload }) =>
            active && payload?.[0] ? (
              <div className="rounded-md border bg-card px-3 py-2 text-xs shadow-lg">{formatCurrency(Number(payload[0].value))}</div>
            ) : null
          }
        />
        <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#cashFlow)" animationDuration={900} />
      </AreaChart>
    </ResponsiveContainer>
  );
});
