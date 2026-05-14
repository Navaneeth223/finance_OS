"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

export type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

export function useAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "seed",
      role: "assistant",
      content: "I have your income, budgets, and spending pattern loaded. Ask me for a savings plan or an overspending diagnosis."
    }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = { id: `user_${Date.now()}`, role: "user", content: message };
    const assistantId = `assistant_${Date.now()}`;
    setMessages((current) => [...current, userMessage, { id: assistantId, role: "assistant", content: "" }]);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      if (!response.ok || !response.body) throw new Error("AI response failed");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const result = await reader.read();
        done = result.done;
        const token = decoder.decode(result.value);
        if (token) {
          setMessages((current) =>
            current.map((item) => (item.id === assistantId ? { ...item, content: item.content + token } : item))
          );
        }
      }
      toast.success("Advisor response generated");
    } catch {
      toast.error("Advisor is unavailable");
    } finally {
      setIsStreaming(false);
    }
  }, []);

  return { messages, isStreaming, sendMessage };
}
