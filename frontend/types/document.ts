export type DocumentType = "specification" | "drawing" | "submittal" | "other";

/**
 * A document's ingestion-pipeline lifecycle. Sprint 2 hardening only ever
 * produces "uploaded" — queued/processing/ready/failed are reserved for the
 * Sprint 3 ingestion pipeline to transition documents through.
 */
export type ProcessingStatus = "uploaded" | "queued" | "processing" | "ready" | "failed";

export type ProjectDocument = {
  id: string;
  projectId: string;
  name: string;
  type: DocumentType;
  revision: string;
  processingStatus: ProcessingStatus;
  fileSizeBytes: number;
  contentType: string | null;
  uploadedAt: string;
};
