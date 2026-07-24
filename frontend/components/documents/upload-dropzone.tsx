"use client";

import { CircleCheck, CircleX, Loader2, UploadCloud, X } from "lucide-react";
import type { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DocumentType } from "@/types/document";
import type { UploadQueueItem } from "@/hooks/use-document-upload";

const documentTypeOptions: { value: DocumentType; label: string }[] = [
  { value: "specification", label: "Specification" },
  { value: "drawing", label: "Drawing" },
  { value: "submittal", label: "Vendor Submittal" },
  { value: "other", label: "Other Document" },
];

type UploadDropzoneProps = {
  documentType: DocumentType;
  onDocumentTypeChange: (type: DocumentType) => void;
  getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps;
  getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps;
  isDragActive: boolean;
  open: () => void;
  queue: UploadQueueItem[];
  onDismissItem: (key: string) => void;
};

export function UploadDropzone({
  documentType,
  onDocumentTypeChange,
  getRootProps,
  getInputProps,
  isDragActive,
  open,
  queue,
  onDismissItem,
}: UploadDropzoneProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label htmlFor="upload-document-type" className="text-sm font-medium text-foreground">
          Document type
        </label>
        <select
          id="upload-document-type"
          value={documentType}
          onChange={(event) => onDocumentTypeChange(event.target.value as DocumentType)}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          {documentTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:border-primary/40 hover:bg-muted/50",
          isDragActive && "border-primary/60 bg-muted/60"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex size-10 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm">
          <UploadCloud className="size-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Drag and drop files, or browse
          </p>
          <p className="text-xs text-muted-foreground">PDF files up to 50&nbsp;MB</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={open}>
          Browse Files
        </Button>
      </div>

      {queue.length > 0 ? (
        <ul className="space-y-2">
          {queue.map((item) => (
            <li
              key={item.key}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm"
            >
              {item.status === "uploading" ? (
                <Loader2
                  className="size-4 shrink-0 animate-spin text-muted-foreground"
                  aria-hidden="true"
                />
              ) : item.status === "success" ? (
                <CircleCheck className="size-4 shrink-0 text-primary" aria-hidden="true" />
              ) : (
                <CircleX className="size-4 shrink-0 text-destructive" aria-hidden="true" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-foreground">{item.fileName}</p>
                {item.status === "uploading" ? (
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                    {/* Progress is a runtime value with no static Tailwind equivalent — inline width is the correct exception here. */}
                    <div
                      className="h-full rounded-full bg-primary transition-[width]"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                ) : item.status === "error" ? (
                  <p className="mt-0.5 text-xs text-destructive">{item.errorMessage}</p>
                ) : null}
              </div>
              {item.status === "error" ? (
                <button
                  type="button"
                  aria-label={`Dismiss ${item.fileName}`}
                  onClick={() => onDismissItem(item.key)}
                  className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
