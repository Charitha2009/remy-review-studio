import { apiClient } from "@/lib/api-client";
import type { DocumentType, ProjectDocument } from "@/types/document";

export async function fetchProjectDocuments(projectId: string): Promise<ProjectDocument[]> {
  const response = await apiClient.get<ProjectDocument[]>(
    `/api/v1/projects/${projectId}/documents`
  );
  return response.data;
}

export async function uploadProjectDocument(
  projectId: string,
  file: File,
  type: DocumentType,
  onProgress?: (percent: number) => void
): Promise<ProjectDocument> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const response = await apiClient.post<ProjectDocument>(
    `/api/v1/projects/${projectId}/documents`,
    formData,
    {
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) return;
        onProgress(Math.round((event.loaded / event.total) * 100));
      },
    }
  );
  return response.data;
}

export async function downloadProjectDocument(documentId: string): Promise<Blob> {
  const response = await apiClient.get<Blob>(`/api/v1/documents/${documentId}/download`, {
    responseType: "blob",
  });
  return response.data;
}
