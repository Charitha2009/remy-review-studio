import Link from "next/link";
import { Archive, Files, TriangleAlert } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import type { ProjectSummary } from "@/types/project";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  const metaLine = [project.projectNumber, project.buildingType]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground ring-1 ring-foreground/10 transition-colors hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground group-hover:underline">
            {project.name}
          </p>
          {metaLine ? (
            <p className="truncate text-xs text-muted-foreground">
              {metaLine}
            </p>
          ) : null}
        </div>
        {project.status === "archived" ? (
          <StatusBadge icon={Archive} label="Archived" tone="neutral" />
        ) : null}
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Files className="size-3.5" aria-hidden="true" />
          {project.documentCount} documents
        </span>
        <span className="inline-flex items-center gap-1">
          <TriangleAlert className="size-3.5" aria-hidden="true" />
          {project.openFindingCount} open findings
        </span>
      </div>
    </Link>
  );
}
