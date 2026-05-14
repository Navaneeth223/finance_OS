import { NextResponse } from "next/server";
import { demoTransactions } from "@/lib/finance-data";
import { transactionInputSchema } from "@/lib/validators";

export async function GET() {
  return NextResponse.json({ transactions: demoTransactions });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = transactionInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  return NextResponse.json({
    transaction: {
      id: `txn_${Date.now()}`,
      source: "Manual",
      confidence: 91,
      ...parsed.data
    }
  });
}
