import { notFound } from "next/navigation";

import { ReviewActions } from "@/components/reviews/review-actions";
import { ReviewEmptyState } from "@/components/reviews/review-empty-state";
import { ReviewHeader } from "@/components/reviews/review-header";
import { ReviewMetadata } from "@/components/reviews/review-metadata";
import { ReviewSummary } from "@/components/reviews/review-summary";
import { ReviewTimeline } from "@/components/reviews/review-timeline";
import { getReview } from "@/lib/placeholder-reviews";

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; reviewId: string }>;
}) {
  const { projectId, reviewId } = await params;
  const review = getReview(reviewId);

  if (!review || review.projectId !== projectId) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <ReviewHeader review={review} />

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Summary</h2>
        <ReviewSummary review={review} />
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          Review Metadata
        </h2>
        <ReviewMetadata review={review} />
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Timeline</h2>
        <ReviewTimeline review={review} />
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Findings</h2>
        <div className="rounded-xl border border-border bg-card p-6">
          <ReviewEmptyState />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          Engineer Actions
        </h2>
        <ReviewActions />
      </section>
    </div>
  );
}
