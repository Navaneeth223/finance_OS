import { NextResponse } from "next/server";
import { demoBudgets } from "@/lib/finance-data";
import { budgetInputSchema } from "@/lib/validators";

export async function GET() {
  return NextResponse.json({ budgets: demoBudgets });
}

export async function POST(request: Request) {
  const parsed = budgetInputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  return NextResponse.json({ budget: { id: `budget_${Date.now()}`, spent: 0, ...parsed.data } });
}
