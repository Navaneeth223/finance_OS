import OpenAI from "openai";
import type { Transaction } from "@/lib/finance-data";

export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export function fallbackCategory(merchant: string) {
  const lower = merchant.toLowerCase();
  if (/(salary|invoice|refund)/.test(lower)) return "INCOME";
  if (/(swiggy|zomato|coffee|grocery)/.test(lower)) return "FOOD";
  if (/(uber|metro|fuel)/.test(lower)) return "TRANSPORT";
  if (/(rent|maintenance)/.test(lower)) return "HOUSING";
  if (/(netflix|spotify|prime)/.test(lower)) return "SUBSCRIPTIONS";
  if (/(apollo|pharmacy|cult|doctor)/.test(lower)) return "HEALTH";
  if (/(flight|hotel|airlines)/.test(lower)) return "TRAVEL";
  if (/(electricity|airtel|water)/.test(lower)) return "UTILITIES";
  return "SHOPPING";
}

export function buildFinanceContext(transactions: Transaction[]) {
  const expenses = transactions.filter((transaction) => transaction.amount < 0);
  const income = transactions.filter((transaction) => transaction.amount > 0);
  const totalExpense = Math.abs(expenses.reduce((sum, transaction) => sum + transaction.amount, 0));
  const totalIncome = income.reduce((sum, transaction) => sum + transaction.amount, 0);
  return { totalExpense, totalIncome, savingsRate: Math.round(((totalIncome - totalExpense) / totalIncome) * 100) };
}
