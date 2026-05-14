import { NextResponse } from "next/server";
import { fallbackCategory, openai } from "@/lib/openai";
import { checkAIRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({
  transactions: z.array(z.object({ id: z.string(), merchant: z.string(), amount: z.number() })).min(1).max(100)
});

export async function POST(request: Request) {
  const limited = await checkAIRateLimit(request.headers.get("x-forwarded-for") ?? "local");
  if (!limited.success) return NextResponse.json({ error: "AI rate limit exceeded" }, { status: 429 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  if (!openai) {
    return NextResponse.json({
      categories: parsed.data.transactions.map((transaction) => ({
        id: transaction.id,
        category: fallbackCategory(transaction.merchant),
        confidence: 86
      }))
    });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Categorize personal finance transactions. Return JSON: { categories: [{ id, category, confidence }] }. Categories: FOOD,HOUSING,TRANSPORT,SHOPPING,TRAVEL,HEALTH,ENTERTAINMENT,SUBSCRIPTIONS,INVESTMENTS,INCOME,UTILITIES,EDUCATION."
      },
      { role: "user", content: JSON.stringify(parsed.data.transactions) }
    ]
  });

  return NextResponse.json(JSON.parse(completion.choices[0]?.message.content ?? "{\"categories\":[]}"));
}
