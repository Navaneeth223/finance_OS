"use client";

import { memo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { Budget } from "@/lib/finance-data";
import { formatCurrency, percentage } from "@/lib/utils";

export const BudgetRing = memo(function BudgetRing({ budget }: { budget: Budget }) {
  const used = percentage(budget.spent, budget.limit + budget.rollover);
  const data = [
    { name: "spent", value: used },
    { name: "left", value: 100 - used }
  ];
  const color = used >= 100 ? "#ef4444" : used >= 80 ? "#f59e0b" : "#10b981";
  return (
    <div className="flex items-center gap-3">
      <div className="h-20 w-20">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={26} outerRadius={36} startAngle={90} endAngle={-270} paddingAngle={2}>
              <Cell fill={color} />
              <Cell fill="hsl(var(--muted))" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        <p className="text-sm font-semibold">{budget.category}</p>
        <p className="text-xs text-muted-foreground">{formatCurrency(budget.spent)} of {formatCurrency(budget.limit + budget.rollover)}</p>
        <p className="mt-1 text-xs font-medium" style={{ color }}>{used}% used</p>
      </div>
    </div>
  );
});
