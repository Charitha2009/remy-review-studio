import { ClipboardCheck } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

export default function ProjectReviewsPage() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Review sessions run against vendor submittals for this project.
      </p>
      <EmptyState
        icon={ClipboardCheck}
        title="No review sessions yet"
        description="Run a review session against a submittal to see AI-assisted findings here."
      />
    </div>
  );
}
