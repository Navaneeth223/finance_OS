"use client";

import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { demoBudgets, monthlyReport, yoyReport } from "@/lib/finance-data";
import { formatCurrency } from "@/lib/utils";

export function IncomeExpenseChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={monthlyReport}>
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.42} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.32} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickFormatter={(value) => `₹${Number(value) / 1000}k`} tickLine={false} axisLine={false} />
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Area dataKey="income" stroke="#10b981" strokeWidth={3} fill="url(#income)" />
        <Area dataKey="expense" stroke="#ef4444" strokeWidth={3} fill="url(#expense)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CategoryDonut() {
  const colors = ["#38bdf8", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={demoBudgets} dataKey="spent" nameKey="category" innerRadius={70} outerRadius={104} paddingAngle={2}>
          {demoBudgets.map((budget, index) => <Cell key={budget.id} fill={colors[index % colors.length]} />)}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function YearComparisonChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={yoyReport}>
        <XAxis dataKey="quarter" tickLine={false} axisLine={false} />
        <YAxis tickFormatter={(value) => `₹${Number(value) / 1000}k`} tickLine={false} axisLine={false} />
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Bar dataKey="previous" fill="hsl(var(--muted-foreground) / 0.35)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="current" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
