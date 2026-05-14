import { z } from "zod";

const category = z.enum([
  "FOOD",
  "HOUSING",
  "TRANSPORT",
  "SHOPPING",
  "TRAVEL",
  "HEALTH",
  "ENTERTAINMENT",
  "SUBSCRIPTIONS",
  "INVESTMENTS",
  "INCOME",
  "UTILITIES",
  "EDUCATION"
]);

export const transactionInputSchema = z.object({
  merchant: z.string().min(2),
  amount: z.number(),
  type: z.enum(["INCOME", "EXPENSE"]),
  category,
  date: z.string().datetime(),
  notes: z.string().max(500).optional().default(""),
  tags: z.array(z.string().min(1).max(32)).default([])
});

export const transactionPatchSchema = z.object({
  id: z.string().min(1),
  category: category.optional(),
  notes: z.string().max(500).optional(),
  tags: z.array(z.string().min(1).max(32)).optional()
});

export const budgetInputSchema = z.object({
  category,
  limit: z.number().positive(),
  rollover: z.number().min(0).default(0)
});

export const chatInputSchema = z.object({
  message: z.string().min(2).max(1200)
});
