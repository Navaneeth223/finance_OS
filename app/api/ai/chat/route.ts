import { NextResponse } from "next/server";
import { demoTransactions } from "@/lib/finance-data";
import { buildFinanceContext, openai } from "@/lib/openai";
import { checkAIRateLimit } from "@/lib/rate-limit";
import { chatInputSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const limited = await checkAIRateLimit(request.headers.get("x-forwarded-for") ?? "local");
  if (!limited.success) return NextResponse.json({ error: "AI rate limit exceeded" }, { status: 429 });

  const parsed = chatInputSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const encoder = new TextEncoder();
  const context = buildFinanceContext(demoTransactions);

  if (!openai) {
    const text = `Based on your current savings rate of ${context.savingsRate}%, start with three moves: cap weekday food delivery, keep subscriptions under Rs 2,500, and move Rs 25,000 to investments on salary day. Month 1 trims leaks, month 2 automates transfers, and month 3 raises SIP allocation if cash flow stays positive.`;
    return new Response(
      new ReadableStream({
        start(controller) {
          for (const token of text.split(" ")) controller.enqueue(encoder.encode(`${token} `));
          controller.close();
        }
      }),
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are a precise personal finance advisor. User context: ${JSON.stringify(context)}. Use INR and produce concise, actionable advice.`
      },
      { role: "user", content: parsed.data.message }
    ]
  });

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const token = chunk.choices[0]?.delta.content;
          if (token) controller.enqueue(encoder.encode(token));
        }
        controller.close();
      }
    }),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
