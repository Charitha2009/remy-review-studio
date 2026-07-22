import { FileText } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

export default function ProjectReportsPage() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Exportable summaries of completed review sessions.
      </p>
      <EmptyState
        icon={FileText}
        title="No reports yet"
        description="Complete a review session to generate an exportable report."
      />
    </div>
  );
}
