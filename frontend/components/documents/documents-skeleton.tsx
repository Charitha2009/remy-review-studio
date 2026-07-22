import { Skeleton } from "@/components/ui/skeleton";

export function DocumentsSkeleton() {
  return (
    <div role="status" aria-label="Loading documents" className="space-y-8">
      <span className="sr-only">Loading documents…</span>
      {[0, 1, 2].map((section) => (
        <div key={section} className="space-y-3" aria-hidden="true">
          <Skeleton className="h-5 w-40" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
