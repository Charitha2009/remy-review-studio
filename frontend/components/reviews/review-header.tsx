import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ReviewStatusBadge } from "@/components/reviews/review-status-badge";
import { reviewTypeLabels } from "@/lib/review-labels";
import { formatDate } from "@/lib/utils";
import type { ReviewSession } from "@/types/review";

/** Key facts an engineer needs before reading further — identity, not detail (see ReviewMetadata for the rest). */
function headerFacts(review: ReviewSession): { label: string; value: string }[] {
  return [
    { label: "Vendor", value: review.vendor },
    { label: "Specification", value: review.specification },
    { label: "Drawing", value: review.drawing },
    { label: "Review Type", value: reviewTypeLabels[review.reviewType] },
    { label: "Created", value: formatDate(review.createdAt) },
    { label: "Started", value: review.startedAt ? formatDate(review.startedAt) : "—" },
    { label: "Completed", value: review.completedAt ? formatDate(review.completedAt) : "—" },
  ];
}

export function ReviewHeader({ review }: { review: ReviewSession }) {
  return (
    <div className="space-y-3">
      <Breadcrumbs
        items={[
          { label: "Reviews", href: `/projects/${review.projectId}/reviews` },
          { label: review.name },
        ]}
      />
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold text-foreground">{review.name}</h1>
        <ReviewStatusBadge status={review.status} />
      </div>
      <p className="text-sm text-muted-foreground">
        Comparing {review.vendorSubmittal || "the vendor submittal"} from{" "}
        {review.vendor} against {review.specification} and {review.drawing}.
      </p>
      <dl className="flex flex-wrap gap-x-5 gap-y-1.5 border-t border-border pt-3 text-xs">
        {headerFacts(review).map((fact) => (
          <div key={fact.label} className="flex items-baseline gap-1">
            <dt className="font-medium text-muted-foreground">{fact.label}:</dt>
            <dd className="text-foreground">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
