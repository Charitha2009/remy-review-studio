import { ClipboardCheck } from "lucide-react";

import { ReviewCard } from "@/components/reviews/review-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { ReviewSession } from "@/types/review";

export function ReviewList({ reviews }: { reviews: ReviewSession[] }) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={ClipboardCheck}
        title="No review sessions yet."
        description="Create a review session to compare vendor submittals against project specifications."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
