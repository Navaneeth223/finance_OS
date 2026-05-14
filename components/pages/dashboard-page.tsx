"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Brain, ShieldCheck } from "lucide-react";
import { BudgetRing } from "@/components/charts/budget-ring";
import { CashFlowChart } from "@/components/charts/cash-flow-chart";
import { SectionErrorBoundary } from "@/components/error-boundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { useBudgets } from "@/hooks/use-budgets";
import { formatCurrency } from "@/lib/utils";

export function DashboardPage() {
  const netWorth = useAnimatedNumber(2845000, formatCurrency);
  const score = useAnimatedNumber(86);
  const { data, isLoading } = useBudgets();

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-lg bg-[#08111f] p-5 text-white shadow-glow lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,.24),transparent_34%),radial-gradient(circle_at_84%_18%,rgba(16,185,129,.18),transparent_30%)]" />
        <div className="relative grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
          <motion.div layoutId="hero-net-worth" className="glass-card rounded-lg p-6">
            <p className="text-sm text-white/64">Total net worth</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-normal sm:text-6xl">{netWorth}</h2>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-md bg-emerald-400/15 px-3 py-2 text-emerald-100"><ArrowUpRight className="h-4 w-4" /> 18.4% YoY</span>
              <span className="inline-flex items-center gap-2 rounded-md bg-sky-400/15 px-3 py-2 text-sky-100"><ShieldCheck className="h-4 w-4" /> 11.2 months runway</span>
            </div>
          </motion.div>
          <motion.div layoutId="hero-score" className="glass-card rounded-lg p-6">
            <p className="text-sm text-white/64">Financial health score</p>
            <div className="mt-5 grid place-items-center">
              <div className="grid h-36 w-36 place-items-center rounded-full border-[12px] border-emerald-400/90 bg-white/8">
                <span className="text-4xl font-semibold">{score}</span>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-white/70">Excellent cash-flow discipline with rising savings velocity.</p>
          </motion.div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <SectionErrorBoundary title="Cash flow chart">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>30-day cash flow</CardTitle>
              <span className="inline-flex items-center gap-1 text-sm text-emerald-500"><ArrowUpRight className="h-4 w-4" /> +₹41k</span>
            </CardHeader>
            <CardContent><CashFlowChart /></CardContent>
          </Card>
        </SectionErrorBoundary>
        <Card>
          <CardHeader><CardTitle>AI weekly insight</CardTitle><Brain className="h-4 w-4 text-primary" /></CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">Food spend is 34% higher</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Weekday delivery frequency rose from 4 to 7 orders. Moving two dinners to groceries would save about ₹3,200 this week.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-28" />)
          : data?.budgets.map((budget) => (
              <Card key={budget.id}>
                <CardContent className="pt-5"><BudgetRing budget={budget} /></CardContent>
              </Card>
            ))}
      </section>
    </div>
  );
}
