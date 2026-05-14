"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-[60vh] place-items-center p-6">
      <section className="max-w-md rounded-lg border bg-card p-8 text-center">
        <h1 className="text-2xl font-semibold">This view needs a refresh</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Finance OS caught the issue before it reached your data.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </section>
    </main>
  );
}
