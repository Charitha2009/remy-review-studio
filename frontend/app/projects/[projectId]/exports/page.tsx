import { Download } from "lucide-react";

import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function ProjectExportsPage() {
  return (
    <PagePlaceholder
      title="Exports"
      description="Download review findings as PDF or Markdown reports."
      emptyIcon={Download}
      emptyTitle="Nothing to export yet"
      emptyDescription="Complete a compliance review to generate an exportable report."
    />
  );
}
