import { AlertOctagon, ClipboardCheck, Files, Info, TriangleAlert } from "lucide-react";

import { MetricCard } from "@/components/shared/metric-card";
import type { ReviewSession } from "@/types/review";

export function ReviewSummary({ review }: { review: ReviewSession }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      <MetricCard
        icon={Files}
        label="Documents Compared"
        value={review.documentsComparedCount}
      />
      <MetricCard
        icon={ClipboardCheck}
        label="Total Findings"
        value={review.findingCount}
      />
      <MetricCard
        icon={AlertOctagon}
        label="Critical"
        value={review.findingsBySeverity.critical}
      />
      <MetricCard
        icon={TriangleAlert}
        label="Major"
        value={review.findingsBySeverity.major}
      />
      <MetricCard icon={Info} label="Minor" value={review.findingsBySeverity.minor} />
    </div>
  );
}
