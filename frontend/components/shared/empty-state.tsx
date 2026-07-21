import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  /** Denser spacing for use inside popovers/dropdowns instead of a full page region. */
  compact?: boolean;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact
          ? "gap-2 px-4 py-6"
          : "gap-3 rounded-lg border border-dashed border-border px-6 py-12",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-muted text-muted-foreground",
          compact ? "size-8" : "size-10"
        )}
      >
        <Icon className={compact ? "size-4" : "size-5"} aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p
            className={cn(
              "text-muted-foreground",
              compact ? "text-xs" : "mx-auto max-w-sm text-sm"
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
