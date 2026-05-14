import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "dd MMM yyyy");
}

export function percentage(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((value / total) * 100));
}

export function parseSmartQuery(query: string) {
  const lower = query.toLowerCase();
  const category = ["food", "travel", "shopping", "transport", "health", "subscriptions"].find((item) =>
    lower.includes(item)
  );
  const amountMatch = lower.match(/[₹r]?\s?(\d{2,7})/);
  const operator = lower.includes("over") || lower.includes("above") ? "gt" : lower.includes("under") ? "lt" : null;
  return {
    category,
    amount: amountMatch ? Number(amountMatch[1]) : null,
    operator,
    lastMonth: lower.includes("last month")
  };
}
