import { NextResponse } from "next/server";
import { transactionPatchSchema } from "@/lib/validators";

export async function PATCH(request: Request) {
  const body = await request.json();
  const parsed = transactionPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  return NextResponse.json({ transaction: parsed.data });
}
