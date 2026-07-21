export type ProjectStatus = "active" | "archived";

export type Project = {
  id: string;
  name: string;
  projectNumber: string | null;
  client: string | null;
  location: string | null;
  buildingType: string | null;
  description: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

/** What the Projects List and Workspace Overview actually render. */
export type ProjectSummary = Project & {
  documentCount: number;
  openFindingCount: number;
  lastActivityAt: string | null;
};
