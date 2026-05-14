"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Transaction } from "@/lib/finance-data";

async function getTransactions() {
  const response = await fetch("/api/transactions");
  if (!response.ok) throw new Error("Unable to load transactions");
  return (await response.json()) as { transactions: Transaction[] };
}

export function useTransactions() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["transactions"], queryFn: getTransactions });

  const updateTransaction = useMutation({
    mutationFn: async (input: Pick<Transaction, "id"> & Partial<Pick<Transaction, "category" | "notes" | "tags">>) => {
      const response = await fetch(`/api/transactions/${input.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      if (!response.ok) throw new Error("Update failed");
      return input;
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });
      const previous = queryClient.getQueryData<{ transactions: Transaction[] }>(["transactions"]);
      queryClient.setQueryData<{ transactions: Transaction[] }>(["transactions"], (current) => ({
        transactions:
          current?.transactions.map((transaction) =>
            transaction.id === input.id ? { ...transaction, ...input } : transaction
          ) ?? []
      }));
      return { previous };
    },
    onError: (_error, _input, context) => {
      queryClient.setQueryData(["transactions"], context?.previous);
      toast.error("Transaction update failed");
    },
    onSuccess: () => toast.success("Transaction updated", { action: { label: "Undo", onClick: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }) } })
  });

  return { ...query, updateTransaction };
}
