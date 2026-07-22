import { Ban, CircleCheck, CircleX, Clock, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { StatusBadge, type StatusTone } from "@/components/shared/status-badge";
import type { ReviewStatus } from "@/types/review";

const statusConfig: Record<
  ReviewStatus,
  { icon: LucideIcon; label: string; tone: StatusTone }
> = {
  queued: { icon: Clock, label: "Queued", tone: "neutral" },
  running: { icon: Loader2, label: "Running", tone: "warning" },
  completed: { icon: CircleCheck, label: "Completed", tone: "success" },
  failed: { icon: CircleX, label: "Failed", tone: "danger" },
  cancelled: { icon: Ban, label: "Cancelled", tone: "neutral" },
};

/** Renders a review session's lifecycle status — the engineer's ground truth, not an AI confidence signal. */
export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const config = statusConfig[status];
  return <StatusBadge icon={config.icon} label={config.label} tone={config.tone} />;
}
