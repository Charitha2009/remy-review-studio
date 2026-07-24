import { Skeleton } from "@/components/ui/skeleton";

export function WorkspaceHeaderSkeleton() {
  return (
    <div role="status" aria-label="Loading project" className="space-y-4">
      <span className="sr-only">Loading project…</span>
      <div aria-hidden="true" className="space-y-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-7 w-64" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  );
}
