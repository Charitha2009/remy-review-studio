import type { ReviewSession } from "@/types/review";

/**
 * Static placeholder data for the Review Management milestone — no backend,
 * no persistence. Covers all five statuses across two projects so both the
 * populated (ReviewCard grid) and empty-state branches of ReviewList render
 * somewhere. Replace with a real review lookup without changing any of this
 * module's call sites.
 */
export const placeholderReviews: ReviewSession[] = [
  {
    id: "review-fire-door-submittal",
    projectId: "hospital-expansion",
    name: "Fire Door Submittal",
    vendor: "ABC Fire Systems",
    specification: "Division 08",
    drawing: "A201",
    vendorSubmittal: "Fire Door Hardware Submittal",
    reviewType: "full",
    submittalRevision: "Revision 3",
    reviewer: "AI Assisted",
    status: "completed",
    findingCount: 14,
    findingsBySeverity: { critical: 2, major: 7, minor: 5 },
    documentsComparedCount: 3,
    createdAt: "2026-07-21T08:15:00.000Z",
    startedAt: "2026-07-21T08:20:00.000Z",
    completedAt: "2026-07-21T08:47:00.000Z",
  },
  {
    id: "review-concrete-mix-design",
    projectId: "hospital-expansion",
    name: "Concrete Mix Design Review",
    vendor: "ABC Ready Mix",
    specification: "Division 03",
    drawing: "S101",
    vendorSubmittal: "Concrete Mix Submittal — ABC Ready Mix",
    reviewType: "specification",
    submittalRevision: "Revision 1",
    reviewer: "AI Assisted",
    status: "running",
    findingCount: 0,
    findingsBySeverity: { critical: 0, major: 0, minor: 0 },
    documentsComparedCount: 3,
    createdAt: "2026-07-21T09:05:00.000Z",
    startedAt: "2026-07-21T09:06:00.000Z",
    completedAt: null,
  },
  {
    id: "review-mechanical-riser",
    projectId: "hospital-expansion",
    name: "Mechanical Riser Review",
    vendor: "Apex Mechanical",
    specification: "Division 23",
    drawing: "M401",
    vendorSubmittal: "Mechanical Equipment Submittal",
    reviewType: "full",
    submittalRevision: "Revision 1",
    reviewer: "AI Assisted",
    status: "queued",
    findingCount: 0,
    findingsBySeverity: { critical: 0, major: 0, minor: 0 },
    documentsComparedCount: 2,
    createdAt: "2026-07-21T10:00:00.000Z",
    startedAt: null,
    completedAt: null,
  },
  {
    id: "review-finishes-package",
    projectId: "hospital-expansion",
    name: "Finishes Package Review",
    vendor: "Premier Finishes Co",
    specification: "Division 09",
    drawing: "A501",
    vendorSubmittal: "Finishes Product Data",
    reviewType: "full",
    submittalRevision: "Revision 2",
    reviewer: "AI Assisted",
    status: "failed",
    findingCount: 0,
    findingsBySeverity: { critical: 0, major: 0, minor: 0 },
    documentsComparedCount: 3,
    createdAt: "2026-07-18T13:00:00.000Z",
    startedAt: "2026-07-18T13:02:00.000Z",
    completedAt: "2026-07-18T13:09:00.000Z",
  },
  {
    id: "review-terminal-baggage-system",
    projectId: "airport-renovation",
    name: "Terminal Baggage System Review",
    vendor: "SkyLine Conveyors",
    specification: "Division 34",
    drawing: "T-201",
    vendorSubmittal: "Baggage Handling System Submittal",
    reviewType: "drawing",
    submittalRevision: "Revision 1",
    reviewer: "AI Assisted",
    status: "cancelled",
    findingCount: 0,
    findingsBySeverity: { critical: 0, major: 0, minor: 0 },
    documentsComparedCount: 2,
    createdAt: "2026-07-15T09:00:00.000Z",
    startedAt: "2026-07-15T09:10:00.000Z",
    completedAt: "2026-07-15T09:12:00.000Z",
  },
];

export function getProjectReviews(projectId: string): ReviewSession[] {
  return placeholderReviews.filter((review) => review.projectId === projectId);
}

export function getReview(reviewId: string): ReviewSession | undefined {
  return placeholderReviews.find((review) => review.id === reviewId);
}
