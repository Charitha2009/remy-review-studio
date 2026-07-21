import { Files } from "lucide-react";

import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function ProjectDocumentsPage() {
  return (
    <PagePlaceholder
      title="Documents"
      description="Specifications, drawings, and vendor submittals for this project."
      emptyIcon={Files}
      emptyTitle="No documents yet"
      emptyDescription="Upload specifications, drawings, and submittals to start a compliance review."
    />
  );
}
