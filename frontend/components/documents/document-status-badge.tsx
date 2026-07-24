import { CircleCheck, CircleX, Clock, Loader2, Upload } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { StatusBadge, type StatusTone } from "@/components/shared/status-badge";
import type { ProcessingStatus } from "@/types/document";

const statusConfig: Record<
  ProcessingStatus,
  { icon: LucideIcon; label: string; tone: StatusTone }
> = {
  uploaded: { icon: Upload, label: "Uploaded", tone: "neutral" },
  queued: { icon: Clock, label: "Queued", tone: "neutral" },
  processing: { icon: Loader2, label: "Processing", tone: "warning" },
  ready: { icon: CircleCheck, label: "Ready", tone: "success" },
  failed: { icon: CircleX, label: "Failed", tone: "danger" },
};

/** Renders a document's ingestion-pipeline status. Sprint 3 will only ever update `processingStatus` — this mapping is the single place that changes. */
export function DocumentStatusBadge({ status }: { status: ProcessingStatus }) {
  const config = statusConfig[status];
  return <StatusBadge icon={config.icon} label={config.label} tone={config.tone} />;
}
