import { Archive, CircleCheck } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProjectMetadata } from "@/components/shared/project-metadata";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Project } from "@/types/project";

const statusConfig = {
  active: { icon: CircleCheck, label: "Active", tone: "success" as const },
  archived: { icon: Archive, label: "Archived", tone: "neutral" as const },
};

export function WorkspaceHeader({ project }: { project: Project }) {
  const status = statusConfig[project.status];

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "Projects", href: "/projects" },
          { label: project.name },
        ]}
      />
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold text-foreground">
          {project.name}
        </h1>
        <StatusBadge icon={status.icon} label={status.label} tone={status.tone} />
      </div>
      <ProjectMetadata
        items={[
          { label: "Project Number", value: project.projectNumber ?? "—" },
          { label: "Client", value: project.client ?? "—" },
          { label: "Location", value: project.location ?? "—" },
          { label: "Building Type", value: project.buildingType ?? "—" },
        ]}
      />
      {project.description ? (
        <p className="max-w-2xl text-sm text-muted-foreground">
          {project.description}
        </p>
      ) : null}
    </div>
  );
}
