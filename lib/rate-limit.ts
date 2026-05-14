import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export async function checkAIRateLimit(identifier: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { success: true, limit: 20, remaining: 20, reset: Date.now() + 60000 };

  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    analytics: true,
    prefix: "finance-os-ai"
  });

  return limiter.limit(identifier);
}
