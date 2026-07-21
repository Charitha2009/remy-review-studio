import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type StatusTone = "neutral" | "warning" | "danger" | "success";

type StatusBadgeProps = {
  icon: LucideIcon;
  label: string;
  tone?: StatusTone;
  className?: string;
};

const toneClasses: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  warning: "bg-secondary text-secondary-foreground",
  danger: "bg-destructive/10 text-destructive",
  success: "bg-primary/10 text-primary",
};

/** Icon + label pill — never color alone (NFR-A3). Used for project/document/review/finding status. */
export function StatusBadge({
  icon: Icon,
  label,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {label}
    </span>
  );
}
