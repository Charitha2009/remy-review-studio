"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronsUpDown, FolderKanban } from "lucide-react";

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
import { placeholderProjects } from "@/lib/placeholder-projects";
import { cn } from "@/lib/utils";

function currentProjectId(pathname: string): string | null {
  const match = /^\/projects\/([^/]+)/.exec(pathname);
  return match ? match[1] : null;
}

/** Static placeholder projects — no backend, no persistence (see lib/placeholder-projects.ts). */
export function ProjectSwitcher() {
  const pathname = usePathname();
  const activeId = currentProjectId(pathname);
  const activeProject = placeholderProjects.find((p) => p.id === activeId);

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
          <span
            className={cn("truncate", activeProject && "text-foreground")}
          >
            {activeProject ? activeProject.name : "No project selected"}
          </span>
        </span>
        <ChevronsUpDown
          className="size-3.5 shrink-0 opacity-60"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {placeholderProjects.map((project) => (
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
          ))}
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
