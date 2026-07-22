import Link from "next/link";
import { ClipboardCheck } from "lucide-react";

import { ReviewStatusBadge } from "@/components/reviews/review-status-badge";
import { formatRelativeDate } from "@/lib/utils";
import type { ReviewSession } from "@/types/review";

function primaryDateLabel(review: ReviewSession): string {
  if (review.completedAt) {
    return `Completed ${formatRelativeDate(review.completedAt)}`;
  }
  if (review.startedAt) {
    return `Started ${formatRelativeDate(review.startedAt)}`;
  }
  return `Created ${formatRelativeDate(review.createdAt)}`;
}

export function ReviewCard({ review }: { review: ReviewSession }) {
  return (
    <Link
      href={`/projects/${review.projectId}/reviews/${review.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground ring-1 ring-foreground/10 transition-colors hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="truncate font-medium text-foreground group-hover:underline">
          {review.name}
        </p>
        <ReviewStatusBadge status={review.status} />
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <div>
          <dt className="text-muted-foreground">Vendor</dt>
          <dd className="truncate text-foreground">{review.vendor}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Specification</dt>
          <dd className="truncate text-foreground">{review.specification}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Drawing</dt>
          <dd className="truncate text-foreground">{review.drawing}</dd>
        </div>
      </dl>
      <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <ClipboardCheck className="size-3.5" aria-hidden="true" />
          {review.findingCount} {review.findingCount === 1 ? "Finding" : "Findings"}
        </span>
        <span>{primaryDateLabel(review)}</span>
      </div>
    </Link>
  );
}
