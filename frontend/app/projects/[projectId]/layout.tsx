import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { WorkspaceTabs } from "@/components/workspace/workspace-tabs";
import { getPlaceholderProject } from "@/lib/placeholder-projects";

export default async function ProjectWorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = getPlaceholderProject(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-5">
        <WorkspaceHeader project={project} />
        <WorkspaceTabs projectId={projectId} />
      </div>
      {children}
    </div>
  );
}
