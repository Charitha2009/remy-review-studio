import { LayoutDashboard } from "lucide-react";

import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function ProjectOverviewPage() {
  return (
    <PagePlaceholder
      title="Overview"
      description="A snapshot of this project's documents, reviews, and open findings."
      emptyIcon={LayoutDashboard}
      emptyTitle="No activity yet"
      emptyDescription="Upload documents and run a compliance review to see project activity here."
    />
  );
}
