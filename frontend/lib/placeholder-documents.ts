import type { ProjectDocument } from "@/types/document";

/**
 * Static placeholder data for the Document Workspace milestone — no backend,
 * no persistence. Deliberately uneven across projects/sections so both the
 * populated (DocumentCard grid) and empty-state branches of DocumentSection
 * render somewhere. Replace with a real document lookup without changing
 * any of this module's call sites.
 */
export const placeholderDocuments: ProjectDocument[] = [
  {
    id: "doc-1",
    projectId: "hospital-expansion",
    name: "AIA 03300 Concrete Specification",
    type: "specification",
    revision: "Revision 2",
    status: "ready",
    uploadedAt: "2026-06-02T00:00:00.000Z",
  },
  {
    id: "doc-2",
    projectId: "hospital-expansion",
    name: "Division 09 Finishes Specification",
    type: "specification",
    revision: "Revision 1",
    status: "reviewed",
    uploadedAt: "2026-05-20T00:00:00.000Z",
  },
  {
    id: "doc-3",
    projectId: "hospital-expansion",
    name: "East Wing Structural Drawings",
    type: "drawing",
    revision: "Revision 3",
    status: "reviewing",
    uploadedAt: "2026-06-15T00:00:00.000Z",
  },
  {
    id: "doc-4",
    projectId: "hospital-expansion",
    name: "Mechanical Riser Diagram",
    type: "drawing",
    revision: "Revision 1",
    status: "processing",
    uploadedAt: "2026-07-08T00:00:00.000Z",
  },
  {
    id: "doc-5",
    projectId: "hospital-expansion",
    name: "Concrete Mix Submittal — ABC Ready Mix",
    type: "submittal",
    revision: "Revision 1",
    status: "uploaded",
    uploadedAt: "2026-07-12T00:00:00.000Z",
  },
  {
    id: "doc-6",
    projectId: "airport-renovation",
    name: "Terminal B Baggage Handling Specification",
    type: "specification",
    revision: "Revision 1",
    status: "ready",
    uploadedAt: "2026-07-05T00:00:00.000Z",
  },
];

export function getProjectDocuments(projectId: string): ProjectDocument[] {
  return placeholderDocuments.filter((document) => document.projectId === projectId);
}
