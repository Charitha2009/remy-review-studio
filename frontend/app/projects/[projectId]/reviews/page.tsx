import { Plus } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { ReviewDialog } from "@/components/reviews/review-dialog";
import { ReviewList } from "@/components/reviews/review-list";
import { Button } from "@/components/ui/button";
import { getProjectReviews } from "@/lib/placeholder-reviews";

export default async function ProjectReviewsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const reviews = getProjectReviews(projectId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Review Sessions"
        description="Manage compliance reviews for project documents."
        action={
          <ReviewDialog
            trigger={
              <Button>
                <Plus aria-hidden="true" />
                New Review
              </Button>
            }
          />
        }
      />
      <ReviewList reviews={reviews} />
    </div>
  );
}
