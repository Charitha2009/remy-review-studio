import { cn, formatDateTime } from "@/lib/utils";

export type TimelineItemState = "complete" | "current" | "upcoming" | "failed" | "cancelled";

type TimelineItemProps = {
  label: string;
  timestamp: string | null;
  state: TimelineItemState;
  isLast?: boolean;
};

const dotClasses: Record<TimelineItemState, string> = {
  complete: "bg-primary",
  current: "bg-secondary-foreground ring-4 ring-secondary",
  upcoming: "bg-border",
  failed: "bg-destructive",
  cancelled: "bg-muted-foreground",
};

export function TimelineItem({ label, timestamp, state, isLast = false }: TimelineItemProps) {
  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        <span
          className={cn("size-2.5 shrink-0 rounded-full", dotClasses[state])}
          aria-hidden="true"
        />
        {!isLast ? <span className="w-px flex-1 bg-border" /> : null}
      </div>
      <div className={cn("pb-5", isLast && "pb-0")}>
        <p
          className={cn(
            "text-sm font-medium",
            state === "upcoming" ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {label}
        </p>
        <p className="text-xs text-muted-foreground">
          {timestamp ? formatDateTime(timestamp) : "Pending"}
        </p>
      </div>
    </li>
  );
}
