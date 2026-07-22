"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { toast } from "sonner";

import { useUploadDocument } from "@/hooks/use-project-documents";
import { getApiErrorMessage } from "@/lib/api-client";
import type { DocumentType } from "@/types/document";

export type UploadQueueItem = {
  key: string;
  fileName: string;
  progress: number;
  status: "uploading" | "success" | "error";
  errorMessage?: string;
};

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

function describeRejection(rejection: FileRejection): string {
  const code = rejection.errors[0]?.code;
  if (code === "file-too-large") return "File exceeds the 25 MB limit";
  if (code === "file-invalid-type") return "Only PDF, DOC, and DOCX files are supported";
  return rejection.errors[0]?.message ?? "File was rejected";
}

export function useDocumentUpload(projectId: string) {
  const [documentType, setDocumentType] = useState<DocumentType>("specification");
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const uploadMutation = useUploadDocument(projectId);

  const updateItem = useCallback((key: string, patch: Partial<UploadQueueItem>) => {
    setQueue((previous) =>
      previous.map((item) => (item.key === key ? { ...item, ...patch } : item))
    );
  }, []);

  const dismissItem = useCallback((key: string) => {
    setQueue((previous) => previous.filter((item) => item.key !== key));
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      for (const rejection of fileRejections) {
        toast.error(`${rejection.file.name}: ${describeRejection(rejection)}`);
      }

      for (const file of acceptedFiles) {
        const key = `${file.name}-${file.lastModified}-${file.size}-${Date.now()}`;
        setQueue((previous) => [
          ...previous,
          { key, fileName: file.name, progress: 0, status: "uploading" },
        ]);

        uploadMutation.mutate(
          {
            file,
            type: documentType,
            onProgress: (progress) => updateItem(key, { progress }),
          },
          {
            onSuccess: () => {
              updateItem(key, { status: "success", progress: 100 });
              toast.success(`${file.name} uploaded`);
              setTimeout(() => dismissItem(key), 2500);
            },
            onError: (error) => {
              const message = getApiErrorMessage(error);
              updateItem(key, { status: "error", errorMessage: message });
              toast.error(`${file.name}: ${message}`);
            },
          }
        );
      }
    },
    [documentType, dismissItem, updateItem, uploadMutation]
  );

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: true,
  });

  return {
    documentType,
    setDocumentType,
    queue,
    dismissItem,
    getRootProps,
    getInputProps,
    open,
    isDragActive,
  };
}
