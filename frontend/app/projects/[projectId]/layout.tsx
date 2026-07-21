import type { ReactNode } from "react";

import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { WorkspaceTabNav } from "@/components/workspace/workspace-tab-nav";

export default async function ProjectWorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <WorkspaceHeader />
        <WorkspaceTabNav projectId={projectId} />
      </div>
      {children}
    </div>
  );
}
