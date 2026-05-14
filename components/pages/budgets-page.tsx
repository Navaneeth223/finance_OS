"use client";

import { motion } from "framer-motion";
import { Bell, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { BudgetRing } from "@/components/charts/budget-ring";
import { SectionErrorBoundary } from "@/components/error-boundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useBudgets } from "@/hooks/use-budgets";
import type { Category } from "@/lib/finance-data";
import { formatCurrency, percentage } from "@/lib/utils";

const categories: Category[] = ["FOOD", "TRANSPORT", "SHOPPING", "TRAVEL", "HEALTH", "SUBSCRIPTIONS", "UTILITIES", "EDUCATION"];

export function BudgetsPage() {
  const { data, isLoading, createBudget } = useBudgets();
  const [category, setCategory] = useState<Category>("FOOD");
  const [limit, setLimit] = useState(12000);
  const total = useMemo(() => data?.budgets.reduce((sum, budget) => sum + budget.limit + budget.rollover, 0) ?? 0, [data?.budgets]);

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Create budget</CardTitle>
          <span className="text-sm text-muted-foreground">Monthly envelope with rollover logic</span>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <select className="h-10 rounded-md border bg-background px-3 text-sm" value={category} onChange={(event) => setCategory(event.target.value as Category)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <Input type="number" value={limit} onChange={(event) => setLimit(Number(event.target.value))} />
          <Button onClick={() => createBudget.mutate({ category, limit, rollover: 0 })}><Plus className="h-4 w-4" /> Add budget</Button>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[.75fr_1.25fr]">
        <Card>
          <CardHeader><CardTitle>Total monthly plan</CardTitle></CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{formatCurrency(total)}</p>
            <p className="mt-2 text-sm text-muted-foreground">Includes category limits plus rollover balances from under-spent envelopes.</p>
          </CardContent>
        </Card>
        <SectionErrorBoundary title="Budget rings">
          <Card>
            <CardHeader><CardTitle>Category rings</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {isLoading ? Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-24" />) : data?.budgets.map((budget) => <BudgetRing key={budget.id} budget={budget} />)}
            </CardContent>
          </Card>
        </SectionErrorBoundary>
      </section>

      <Card>
        <CardHeader><CardTitle>Budget alerts</CardTitle><Bell className="h-4 w-4 text-primary" /></CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? <Skeleton className="h-72" /> : !data?.budgets.length ? <EmptyState title="No budgets yet" description="Create a monthly category budget to see alerts." /> : data.budgets.map((budget) => {
            const capacity = budget.limit + budget.rollover;
            const used = percentage(budget.spent, capacity);
            const color = used >= 100 ? "bg-red-500" : used >= 80 ? "bg-amber-500" : "bg-emerald-500";
            return (
              <div key={budget.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{budget.category}</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(budget.spent)} spent from {formatCurrency(capacity)}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.success(`${budget.category} alert enabled`, { action: { label: "Undo", onClick: () => toast.info("Alert removed") } })}>
                    80% alert
                  </Button>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(used, 100)}%` }} transition={{ type: "spring", stiffness: 70, damping: 17 }} className={`h-full ${color}`} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
