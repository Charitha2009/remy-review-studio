import type { Project } from "@/types/project";

/**
 * Static placeholder data for the Project Workspace milestone — no backend,
 * no persistence. Shared by the Project Switcher and the workspace layout so
 * both agree on which project IDs exist. Replace with a real project lookup
 * (roadmap Issue #7/#8) without changing any of this module's call sites.
 */
export const placeholderProjects: Project[] = [
  {
    id: "hospital-expansion",
    name: "Hospital Expansion",
    projectNumber: "PRJ-2026-001",
    client: "City Medical Center",
    location: "Orlando, FL",
    buildingType: "Hospital",
    description:
      "Modernization of the east patient wing and expansion of emergency facilities.",
    status: "active",
    createdAt: "2026-01-14T00:00:00.000Z",
    updatedAt: "2026-06-30T00:00:00.000Z",
    archivedAt: null,
  },
  {
    id: "airport-renovation",
    name: "Airport Renovation",
    projectNumber: "PRJ-2026-014",
    client: "Metro Aviation Authority",
    location: "Charlotte, NC",
    buildingType: "Airport",
    description:
      "Terminal B renovation, including updated baggage handling and new passenger boarding bridges.",
    status: "active",
    createdAt: "2026-02-03T00:00:00.000Z",
    updatedAt: "2026-07-10T00:00:00.000Z",
    archivedAt: null,
  },
  {
    id: "office-tower",
    name: "Office Tower",
    projectNumber: "PRJ-2025-087",
    client: "Beacon Development Group",
    location: "Austin, TX",
    buildingType: "Office",
    description:
      "Ground-up construction of a 22-story Class A office tower with ground-floor retail.",
    status: "active",
    createdAt: "2025-11-18T00:00:00.000Z",
    updatedAt: "2026-07-02T00:00:00.000Z",
    archivedAt: null,
  },
];

export function getPlaceholderProject(id: string): Project | undefined {
  return placeholderProjects.find((project) => project.id === id);
}
