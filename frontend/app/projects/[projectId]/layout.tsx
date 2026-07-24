"use client";

import type { ReactNode } from "react";
import { notFound, useParams } from "next/navigation";
import axios from "axios";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { WorkspaceHeaderSkeleton } from "@/components/workspace/workspace-header-skeleton";
import { WorkspaceTabs } from "@/components/workspace/workspace-tabs";
import { useProject } from "@/hooks/use-project";

export default function ProjectWorkspaceLayout({ children }: { children: ReactNode }) {
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params.projectId === "string" ? params.projectId : undefined;

  const { data: project, isLoading, isError, error, refetch } = useProject(projectId);

  if (!projectId) {
    notFound();
  }

  if (isError && axios.isAxiosError(error) && error.response?.status === 404) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-5">
        {isError ? (
          <EmptyState
            icon={TriangleAlert}
            title="Couldn't load this project"
            description="Something went wrong fetching this project. Check your connection and try again."
            action={
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        ) : isLoading || !project ? (
          <WorkspaceHeaderSkeleton />
        ) : (
          <WorkspaceHeader project={project} />
        )}
        <WorkspaceTabs projectId={projectId} />
      </div>
      {children}
    </div>
  );
}
