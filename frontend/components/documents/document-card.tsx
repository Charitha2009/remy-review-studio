import { FileText } from "lucide-react";

import { DocumentStatusBadge } from "@/components/documents/document-status-badge";
import { formatDate } from "@/lib/utils";
import type { DocumentType, ProjectDocument } from "@/types/document";

const typeLabels: Record<DocumentType, string> = {
  specification: "Specification",
  drawing: "Drawing",
  submittal: "Vendor Submittal",
  other: "Other Document",
};

export function DocumentCard({ document }: { document: ProjectDocument }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <FileText className="size-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {document.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {typeLabels[document.type]} · {document.revision}
            </p>
          </div>
        </div>
        <DocumentStatusBadge status={document.status} />
      </div>
      <p className="text-xs text-muted-foreground">
        Uploaded {formatDate(document.uploadedAt)}
      </p>
    </div>
  );
}
