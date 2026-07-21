import { Skeleton } from "@/components/ui/skeleton";

/** Shared loading placeholder used by every top-level route's `loading.tsx`. */
export function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading content" className="space-y-6">
      <span className="sr-only">Loading…</span>
      <div className="space-y-2" aria-hidden="true">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-hidden="true"
      >
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-64 w-full" aria-hidden="true" />
    </div>
  );
}
