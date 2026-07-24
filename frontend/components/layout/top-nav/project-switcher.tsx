"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronsUpDown, FolderKanban, LoaderCircle, TriangleAlert } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button-variants";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/use-projects";
import { cn } from "@/lib/utils";

function currentProjectId(pathname: string): string | null {
  const match = /^\/projects\/([^/]+)/.exec(pathname);
  return match ? match[1] : null;
}

export function ProjectSwitcher() {
  const pathname = usePathname();
  const activeId = currentProjectId(pathname);
  const { data: projects, isLoading, isError, refetch } = useProjects();

  const activeProject = projects?.find((project) => project.id === activeId);
  const triggerLabel = isLoading
    ? "Loading projects…"
    : isError
      ? "Projects unavailable"
      : (activeProject?.name ?? "No project selected");

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
          {isLoading ? (
            <LoaderCircle className="size-4 shrink-0 animate-spin" aria-hidden="true" />
          ) : (
            <FolderKanban className="size-4 shrink-0" aria-hidden="true" />
          )}
          <span className={cn("truncate", activeProject && "text-foreground")}>
            {triggerLabel}
          </span>
        </span>
        <ChevronsUpDown className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isLoading ? (
            <div className="space-y-1 px-2 py-1.5" aria-hidden="true">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : isError ? (
            <EmptyState
              compact
              icon={TriangleAlert}
              title="Couldn't load projects"
              description="Check your connection and try again."
              action={
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="text-xs font-medium text-foreground underline underline-offset-2"
                >
                  Retry
                </button>
              }
            />
          ) : projects && projects.length > 0 ? (
            projects.map((project) => (
              <DropdownMenuLinkItem
                key={project.id}
                closeOnClick
                render={<Link href={`/projects/${project.id}`} />}
              >
                <FolderKanban className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{project.name}</span>
                {project.id === activeId ? (
                  <Check className="ml-auto size-4 shrink-0" aria-hidden="true" />
                ) : null}
              </DropdownMenuLinkItem>
            ))
          ) : (
            <EmptyState
              compact
              icon={FolderKanban}
              title="No projects yet"
              description="Create a project to get started."
            />
          )}
          <DropdownMenuSeparator />
          <DropdownMenuLinkItem
            closeOnClick
            render={<Link href="/projects" />}
            className="text-muted-foreground"
          >
            Browse all projects
          </DropdownMenuLinkItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
