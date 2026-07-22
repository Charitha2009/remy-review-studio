import { CircleCheck, CircleX, FileDown } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Reserves the engineer-disposition and export layout for Sprints 6–7.
 * Disabled until findings exist to act on — no click handlers are wired yet.
 */
export function ReviewActions() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled>
          <CircleCheck aria-hidden="true" />
          Accept All
        </Button>
        <Button variant="outline" disabled>
          <CircleX aria-hidden="true" />
          Reject All
        </Button>
        <Button variant="secondary" disabled>
          <FileDown aria-hidden="true" />
          Export Report
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Available once AI-generated findings are ready for engineer disposition.
      </p>
    </div>
  );
}
