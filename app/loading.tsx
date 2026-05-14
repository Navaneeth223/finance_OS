import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid gap-4 p-6 lg:grid-cols-3">
      <Skeleton className="h-48 lg:col-span-2" />
      <Skeleton className="h-48" />
      <Skeleton className="h-96 lg:col-span-3" />
    </div>
  );
}
