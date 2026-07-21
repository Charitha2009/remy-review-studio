import type { LucideIcon } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

type PagePlaceholderProps = {
  title: string;
  description: string;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
};

/** Shared heading + empty-state shape for Sprint 1's placeholder routes. */
export function PagePlaceholder({
  title,
  description,
  emptyIcon,
  emptyTitle,
  emptyDescription,
}: PagePlaceholderProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <EmptyState
        className="mt-6"
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
      />
    </div>
  );
}
