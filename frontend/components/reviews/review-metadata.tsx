import { ProjectMetadata } from "@/components/shared/project-metadata";
import { reviewTypeLabels } from "@/lib/review-labels";
import type { ReviewSession } from "@/types/review";

/**
 * Reuses the generic metadata grid (see ProjectMetadata) rather than duplicating its markup.
 * Created/Started/Completed live in ReviewHeader instead — this section covers the fields
 * that don't fit the header's at-a-glance strip.
 */
export function ReviewMetadata({ review }: { review: ReviewSession }) {
  return (
    <ProjectMetadata
      items={[
        { label: "Vendor", value: review.vendor },
        { label: "Specification", value: review.specification },
        { label: "Drawing", value: review.drawing },
        { label: "Vendor Submittal", value: review.vendorSubmittal },
        { label: "Submittal Revision", value: review.submittalRevision },
        { label: "Review Type", value: reviewTypeLabels[review.reviewType] },
        { label: "Reviewer", value: review.reviewer },
      ]}
    />
  );
}
