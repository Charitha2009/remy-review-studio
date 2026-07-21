import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button-variants";
import { EmptyState } from "@/components/shared/empty-state";

/** No notification system exists yet; this always shows the empty state. */
export function NotificationButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="View notifications"
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <Bell aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-0">
        <EmptyState
          compact
          icon={Bell}
          title="No new notifications"
          description="You're all caught up."
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
