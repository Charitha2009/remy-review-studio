import { TimelineItem, type TimelineItemState } from "@/components/reviews/timeline-item";
import type { ReviewSession } from "@/types/review";

type Stage = {
  label: string;
  timestamp: string | null;
  state: TimelineItemState;
};

/**
 * Derives timeline stages from the review's own status/timestamps rather than
 * storing a parallel event list — a review only ever has one createdAt/
 * startedAt/completedAt, so there is nothing to keep in sync.
 */
function buildTimelineStages(review: ReviewSession): Stage[] {
  const pastQueued = review.status !== "queued";
  const reachedRunning = review.startedAt !== null;
  const isRunningNow = review.status === "running";
  const isTerminal =
    review.status === "completed" ||
    review.status === "failed" ||
    review.status === "cancelled";

  const finalLabel =
    review.status === "failed"
      ? "Failed"
      : review.status === "cancelled"
        ? "Cancelled"
        : "Completed";

  const finalState: TimelineItemState = !isTerminal
    ? "upcoming"
    : review.status === "failed"
      ? "failed"
      : review.status === "cancelled"
        ? "cancelled"
        : "complete";

  return [
    { label: "Created", timestamp: review.createdAt, state: "complete" },
    {
      label: "Queued",
      timestamp: review.createdAt,
      state: pastQueued ? "complete" : "current",
    },
    {
      label: "Running",
      timestamp: review.startedAt,
      state: reachedRunning ? (isRunningNow ? "current" : "complete") : "upcoming",
    },
    { label: finalLabel, timestamp: review.completedAt, state: finalState },
  ];
}

export function ReviewTimeline({ review }: { review: ReviewSession }) {
  const stages = buildTimelineStages(review);

  return (
    <ol>
      {stages.map((stage, index) => (
        <TimelineItem
          key={stage.label}
          label={stage.label}
          timestamp={stage.timestamp}
          state={stage.state}
          isLast={index === stages.length - 1}
        />
      ))}
    </ol>
  );
}
