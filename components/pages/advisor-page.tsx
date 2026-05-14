"use client";

import { Bot, Send, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAI } from "@/hooks/use-ai";
import { cn } from "@/lib/utils";

const chips = ["How can I save more?", "Where am I overspending?", "Build a 3-month savings plan"];

export function AdvisorPage() {
  const { messages, isStreaming, sendMessage } = useAI();
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;
    const next = message;
    setMessage("");
    await sendMessage(next);
  }

  return (
    <Card className="mx-auto max-w-5xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> AI Advisor</CardTitle>
        <span className="text-sm text-muted-foreground">Streaming GPT-4o guidance with full finance context</span>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Button key={chip} variant="secondary" size="sm" onClick={() => sendMessage(chip)} disabled={isStreaming}>
              <Sparkles className="h-4 w-4" /> {chip}
            </Button>
          ))}
        </div>
        <div className="premium-scrollbar h-[58vh] space-y-4 overflow-y-auto rounded-lg border bg-background p-4">
          {messages.map((item) => (
            <div key={item.id} className={cn("flex", item.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6", item.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                {item.content || <Skeleton className="h-5 w-48" />}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="mt-4 flex gap-2">
          <Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about saving, spending, runway, or investment allocation..." />
          <Button type="submit" disabled={isStreaming}><Send className="h-4 w-4" /> Send</Button>
        </form>
      </CardContent>
    </Card>
  );
}
