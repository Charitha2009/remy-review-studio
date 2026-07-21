import { BadgeCheck, CircleCheck, Eye, Loader2, Upload } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { StatusBadge, type StatusTone } from "@/components/shared/status-badge";
import type { DocumentStatus } from "@/types/document";

const statusConfig: Record<
  DocumentStatus,
  { icon: LucideIcon; label: string; tone: StatusTone }
> = {
  uploaded: { icon: Upload, label: "Uploaded", tone: "neutral" },
  processing: { icon: Loader2, label: "Processing", tone: "warning" },
  ready: { icon: CircleCheck, label: "Ready", tone: "success" },
  reviewing: { icon: Eye, label: "Reviewing", tone: "warning" },
  reviewed: { icon: BadgeCheck, label: "Reviewed", tone: "success" },
};

/** Renders a document's lifecycle status. Future AI processing will only ever update `status` — this mapping is the single place that changes. */
export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const config = statusConfig[status];
  return <StatusBadge icon={config.icon} label={config.label} tone={config.tone} />;
}
