import { ClipboardCheck } from "lucide-react";

import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function ProjectReviewsPage() {
  return (
    <PagePlaceholder
      title="AI Review"
      description="Run AI-assisted compliance reviews against vendor submittals."
      emptyIcon={ClipboardCheck}
      emptyTitle="No reviews yet"
      emptyDescription="Run a compliance review on a submittal to see AI-assisted findings here."
    />
  );
}
