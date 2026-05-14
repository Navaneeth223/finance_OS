"use client";

import { motion } from "framer-motion";
import { Check, FileUp, Search, Sparkles } from "lucide-react";
import Papa from "papaparse";
import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { SectionErrorBoundary } from "@/components/error-boundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactions } from "@/hooks/use-transactions";
import type { Category, Transaction } from "@/lib/finance-data";
import { formatCurrency, formatDate, parseSmartQuery } from "@/lib/utils";

const categories: Category[] = ["FOOD", "HOUSING", "TRANSPORT", "SHOPPING", "TRAVEL", "HEALTH", "ENTERTAINMENT", "SUBSCRIPTIONS", "INVESTMENTS", "INCOME", "UTILITIES", "EDUCATION"];

export function TransactionsPage() {
  const { data, isLoading, updateTransaction } = useTransactions();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const transactions = data?.transactions ?? [];
    const smart = parseSmartQuery(query);
    return transactions.filter((transaction) => {
      const textMatch = `${transaction.merchant} ${transaction.category} ${transaction.notes}`.toLowerCase().includes(query.toLowerCase()) || query.length < 2;
      const categoryMatch = smart.category ? transaction.category.toLowerCase() === smart.category : true;
      const amount = Math.abs(transaction.amount);
      const amountMatch = smart.amount && smart.operator === "gt" ? amount > smart.amount : smart.amount && smart.operator === "lt" ? amount < smart.amount : true;
      return textMatch || (categoryMatch && amountMatch);
    });
  }, [data?.transactions, query]);

  const onDrop = useCallback((files: File[]) => {
    const [file] = files;
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: () => toast.success("CSV imported and queued for AI categorization", { action: { label: "Undo", onClick: () => toast.info("Import reverted") } }),
      error: () => toast.error("CSV import failed")
    });
  }, []);
  const dropzone = useDropzone({ onDrop, accept: { "text/csv": [".csv"] } });

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="grid gap-4 pt-5 lg:grid-cols-[1fr_1.4fr]">
          <div {...dropzone.getRootProps()} className="grid min-h-36 cursor-pointer place-items-center rounded-lg border border-dashed bg-muted/30 p-6 text-center transition hover:bg-muted/50">
            <input {...dropzone.getInputProps()} />
            <div>
              <FileUp className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-3 font-medium">Drop bank CSV here</p>
              <p className="text-sm text-muted-foreground">AI categorization starts automatically after import.</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Smart search</label>
            <div className="mt-2 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="show me food expenses over ₹500 last month" />
              </div>
              <Button onClick={() => toast.success("AI categorized visible transactions")}><Sparkles className="h-4 w-4" /> Categorize</Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-md bg-muted px-2 py-1">food over ₹500</span>
              <span className="rounded-md bg-muted px-2 py-1">subscriptions</span>
              <span className="rounded-md bg-muted px-2 py-1">travel last month</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <SectionErrorBoundary title="Transactions table">
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <Button variant="outline" size="sm" disabled={selected.length === 0} onClick={() => toast.success(`${selected.length} transactions tagged`, { action: { label: "Undo", onClick: () => setSelected([]) } })}>
              Bulk tag
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-96" /> : filtered.length === 0 ? <EmptyState title="No transactions found" description="Import a statement or relax your smart search filters." /> : <TransactionTable transactions={filtered} selected={selected} setSelected={setSelected} updateTransaction={updateTransaction.mutate} />}
          </CardContent>
        </Card>
      </SectionErrorBoundary>
    </div>
  );
}

function TransactionTable({
  transactions,
  selected,
  setSelected,
  updateTransaction
}: {
  transactions: Transaction[];
  selected: string[];
  setSelected: (selected: string[]) => void;
  updateTransaction: (input: Pick<Transaction, "id"> & Partial<Pick<Transaction, "category" | "notes" | "tags">>) => void;
}) {
  return (
    <div className="premium-scrollbar overflow-x-auto">
      <table className="w-full min-w-[880px] text-sm">
        <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr className="border-b">
            <th className="py-3 pr-3">Select</th><th>Merchant</th><th>Category</th><th>Date</th><th>Notes</th><th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const active = selected.includes(transaction.id);
            return (
              <tr key={transaction.id} className="border-b last:border-0">
                <td className="py-3 pr-3">
                  <button
                    aria-label="Select transaction"
                    onClick={() => setSelected(active ? selected.filter((id) => id !== transaction.id) : [...selected, transaction.id])}
                    className="grid h-6 w-6 place-items-center rounded-md border transition"
                  >
                    {active && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}><Check className="h-4 w-4 text-primary" /></motion.span>}
                  </button>
                </td>
                <td className="font-medium">{transaction.merchant}<p className="text-xs text-muted-foreground">{transaction.source} · {transaction.confidence}% AI</p></td>
                <td>
                  <select className="rounded-md border bg-background px-2 py-1" value={transaction.category} onChange={(event) => updateTransaction({ id: transaction.id, category: event.target.value as Category })}>
                    {categories.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </td>
                <td>{formatDate(transaction.date)}</td>
                <td><Input value={transaction.notes} onChange={(event) => updateTransaction({ id: transaction.id, notes: event.target.value })} /></td>
                <td className={transaction.amount > 0 ? "text-right font-semibold text-emerald-500" : "text-right font-semibold"}>{formatCurrency(transaction.amount)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
