import { Library } from "lucide-react";

import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function KnowledgePage() {
  return (
    <PagePlaceholder
      title="Knowledge"
      description="Semantic search across every ingested document in a project."
      emptyIcon={Library}
      emptyTitle="Knowledge search isn't available yet"
      emptyDescription="Once documents are uploaded and ingested, you'll be able to search across specifications and drawings here."
    />
  );
}
