export type ReviewStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

/** Scope of documents a review session compares the vendor submittal against. */
export type ReviewType = "full" | "specification" | "drawing";

export type ReviewSeverityCounts = {
  critical: number;
  major: number;
  minor: number;
};

/**
 * A Review Session is a business object an engineer manages — not a chat
 * transcript. AI will later create these and populate findings; engineers
 * always own status, dispositions, and completion.
 */
export type ReviewSession = {
  id: string;
  projectId: string;
  name: string;
  vendor: string;
  specification: string;
  drawing: string;
  vendorSubmittal: string;
  reviewType: ReviewType;
  submittalRevision: string;
  reviewer: string;
  status: ReviewStatus;
  findingCount: number;
  findingsBySeverity: ReviewSeverityCounts;
  documentsComparedCount: number;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
};
