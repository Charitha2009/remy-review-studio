"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { downloadProjectDocument, fetchProjectDocuments, uploadProjectDocument } from "@/lib/documents-api";
import type { DocumentType, ProjectDocument } from "@/types/document";

export function documentsQueryKey(projectId: string) {
  return ["projects", projectId, "documents"] as const;
}

export function useProjectDocuments(projectId: string) {
  return useQuery({
    queryKey: documentsQueryKey(projectId),
    queryFn: () => fetchProjectDocuments(projectId),
  });
}

type UploadVariables = {
  file: File;
  type: DocumentType;
  onProgress?: (percent: number) => void;
};

/** On success, appends the created document straight into the cache — the document appears immediately, no refetch round-trip. */
export function useUploadDocument(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation<ProjectDocument, unknown, UploadVariables>({
    mutationFn: ({ file, type, onProgress }) =>
      uploadProjectDocument(projectId, file, type, onProgress),
    onSuccess: (document) => {
      queryClient.setQueryData<ProjectDocument[]>(documentsQueryKey(projectId), (previous) =>
        previous ? [document, ...previous] : [document]
      );
    },
  });
}

type DownloadVariables = {
  documentId: string;
  filename: string;
};

/** Fetches the document as a blob and returns it alongside the filename it should be saved as — the caller triggers the actual browser save. */
export function useDownloadDocument() {
  return useMutation<{ blob: Blob; filename: string }, unknown, DownloadVariables>({
    mutationFn: async ({ documentId, filename }) => ({
      blob: await downloadProjectDocument(documentId),
      filename,
    }),
  });
}
