"use client";

import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { DocumentStatusBadge } from "@/components/documents/document-status-badge";
import { useDownloadDocument } from "@/hooks/use-project-documents";
import { getApiErrorMessage } from "@/lib/api-client";
import { formatDate, formatFileSize, triggerBlobDownload } from "@/lib/utils";
import type { DocumentType, ProjectDocument } from "@/types/document";

const typeLabels: Record<DocumentType, string> = {
  specification: "Specification",
  drawing: "Drawing",
  submittal: "Vendor Submittal",
  other: "Other Document",
};

export function DocumentCard({ document }: { document: ProjectDocument }) {
  const download = useDownloadDocument();

  const handleDownload = () => {
    download.mutate(
      { documentId: document.id, filename: document.name },
      {
        onSuccess: ({ blob, filename }) => triggerBlobDownload(blob, filename),
        onError: (error) => toast.error(getApiErrorMessage(error)),
      }
    );
  };

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
              {typeLabels[document.type]} · {document.revision} ·{" "}
              {formatFileSize(document.fileSizeBytes)}
            </p>
          </div>
        </div>
        <DocumentStatusBadge status={document.processingStatus} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Uploaded {formatDate(document.uploadedAt)}
        </p>
        <button
          type="button"
          onClick={handleDownload}
          disabled={download.isPending}
          aria-label={`Download ${document.name}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          {download.isPending ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="size-3.5" aria-hidden="true" />
          )}
          Download
        </button>
      </div>
    </div>
  );
}
