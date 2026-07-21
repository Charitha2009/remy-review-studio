import { FolderKanban, FolderPlus } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { ProjectsHero } from "@/components/projects/projects-hero";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { Button } from "@/components/ui/button";
import type { ProjectSummary } from "@/types/project";

// No persistence layer exists yet (Phase 1 is UI only) — this is genuinely
// empty, not a stub for fake data. Real data arrives with Project CRUD
// (roadmap Issue #7/#8); this component already branches correctly on it.
const projects: ProjectSummary[] = [];

export default function ProjectsPage() {
  const hasProjects = projects.length > 0;

  if (!hasProjects) {
    return (
      <div className="space-y-6">
        <ProjectsHero />
        <EmptyState
          icon={FolderKanban}
          title="No construction projects yet."
          description="Create your first project to begin uploading specifications, drawings, and vendor submittals."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Workspaces for uploading documents and running compliance reviews."
        action={
          <CreateProjectDialog
            trigger={
              <Button>
                <FolderPlus aria-hidden="true" />
                Create Project
              </Button>
            }
          />
        }
      />
      <ProjectsGrid projects={projects} />
    </div>
  );
}
