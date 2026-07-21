import { Activity, ClipboardCheck, FileText, Files, TriangleAlert } from "lucide-react";

import { MetricCard } from "@/components/shared/metric-card";
import { EmptyState } from "@/components/shared/empty-state";

const metrics = [
  { label: "Documents Uploaded", value: 0, icon: Files },
  { label: "Reviews Completed", value: 0, icon: ClipboardCheck },
  { label: "Open Findings", value: 0, icon: TriangleAlert },
  { label: "Reports Generated", value: 0, icon: FileText },
];

export default function ProjectOverviewPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </div>
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Recent Activity
        </h2>
        <EmptyState
          className="mt-3"
          icon={Activity}
          title="No activity yet"
          description="Upload documents and run a review session to see activity for this project here."
        />
      </div>
    </div>
  );
}
