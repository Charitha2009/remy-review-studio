import { TriangleAlert } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

/**
 * Findings-specific empty state, kept separate from the generic EmptyState
 * primitive so the Findings milestone can add a "Run Review" CTA here later
 * without changing the shared component other empty states depend on.
 */
export function ReviewEmptyState() {
  return (
    <EmptyState
      icon={TriangleAlert}
      title="No findings available."
      description="AI-generated compliance findings will appear here after review processing completes."
    />
  );
}
