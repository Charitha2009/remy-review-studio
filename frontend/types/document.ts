export type DocumentType = "specification" | "drawing" | "submittal" | "other";

/**
 * The full lifecycle a document moves through. AI Review only ever
 * transitions a document along this vocabulary — no new statuses are
 * introduced when Upload/Processing/Review land.
 */
export type DocumentStatus =
  | "uploaded"
  | "processing"
  | "ready"
  | "reviewing"
  | "reviewed";

export type ProjectDocument = {
  id: string;
  projectId: string;
  name: string;
  type: DocumentType;
  revision: string;
  status: DocumentStatus;
  uploadedAt: string;
};
