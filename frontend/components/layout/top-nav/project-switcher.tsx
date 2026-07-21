import Link from "next/link";
import { ChevronsUpDown, FolderKanban } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button-variants";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

/** Placeholder switcher; real project data lands with the Project Dashboard work (FR-2). */
export function ProjectSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Current project"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-44 justify-between text-muted-foreground sm:w-56"
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <FolderKanban className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">No project selected</span>
        </span>
        <ChevronsUpDown
          className="size-3.5 shrink-0 opacity-60"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 p-0">
        <EmptyState
          compact
          icon={FolderKanban}
          title="No projects yet"
          description="Create a project to start reviewing submittals."
          action={
            <DropdownMenuLinkItem
              closeOnClick
              render={<Link href="/projects" />}
              className="mt-1 w-auto justify-center bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              Go to Projects
            </DropdownMenuLinkItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
