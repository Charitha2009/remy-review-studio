import { FolderPlus } from "lucide-react";

import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { Button } from "@/components/ui/button";

/**
 * Phase-1-only onboarding for the empty Projects list — explains the product's
 * value before the user has anything to look at. Once Project Workspaces
 * exist, the workspace itself should teach the workflow instead; remove this
 * and go back to a plain PageHeader at that point.
 */
export function ProjectsHero() {
  return (
    <div className="rounded-xl border border-border bg-card px-6 py-10 text-center text-card-foreground">
      <h1 className="text-xl font-semibold text-foreground">
        Construction projects start here
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Create a project to organize specifications, drawings, vendor
        submittals, AI reviews, and compliance reports in one workspace.
      </p>
      <CreateProjectDialog
        trigger={
          <Button className="mt-4">
            <FolderPlus aria-hidden="true" />
            Create Project
          </Button>
        }
      />
    </div>
  );
}
