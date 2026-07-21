import { Breadcrumbs } from "@/components/shared/breadcrumbs";

/**
 * No project-lookup data source exists yet, so this shows a generic "Project"
 * label rather than the real name — a two-line change once Project CRUD
 * (roadmap Issue #7/#8) lands.
 */
export function WorkspaceHeader() {
  return (
    <Breadcrumbs
      items={[{ label: "Projects", href: "/projects" }, { label: "Project" }]}
    />
  );
}
