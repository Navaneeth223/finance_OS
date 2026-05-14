"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Budget } from "@/lib/finance-data";

async function getBudgets() {
  const response = await fetch("/api/budgets");
  if (!response.ok) throw new Error("Unable to load budgets");
  return (await response.json()) as { budgets: Budget[] };
}

export function useBudgets() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["budgets"], queryFn: getBudgets });

  const createBudget = useMutation({
    mutationFn: async (input: Pick<Budget, "category" | "limit" | "rollover">) => {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      if (!response.ok) throw new Error("Create failed");
      return (await response.json()) as { budget: Budget };
    },
    onMutate: async (input) => {
      const optimistic = { id: `optimistic_${Date.now()}`, spent: 0, ...input };
      queryClient.setQueryData<{ budgets: Budget[] }>(["budgets"], (current) => ({
        budgets: [...(current?.budgets ?? []), optimistic]
      }));
    },
    onSuccess: () => toast.success("Budget created", { action: { label: "Undo", onClick: () => queryClient.invalidateQueries({ queryKey: ["budgets"] }) } }),
    onError: () => toast.error("Budget could not be created")
  });

  return { ...query, createBudget };
}
