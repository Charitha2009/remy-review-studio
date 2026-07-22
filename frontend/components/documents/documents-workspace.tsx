"use client";

import { ClipboardList, FolderOpen, Ruler, TriangleAlert, UploadCloud, Files } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DocumentSection } from "@/components/documents/document-section";
import { DocumentsSkeleton } from "@/components/documents/documents-skeleton";
import { UploadDropzone } from "@/components/documents/upload-dropzone";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { useDocumentUpload } from "@/hooks/use-document-upload";
import { useProjectDocuments } from "@/hooks/use-project-documents";

export function DocumentsWorkspace({ projectId }: { projectId: string }) {
  const { data: documents, isLoading, isError, refetch } = useProjectDocuments(projectId);
  const upload = useDocumentUpload(projectId);

  const specifications = documents?.filter((d) => d.type === "specification") ?? [];
  const drawings = documents?.filter((d) => d.type === "drawing") ?? [];
  const submittals = documents?.filter((d) => d.type === "submittal") ?? [];
  const other = documents?.filter((d) => d.type === "other") ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Documents"
        description="Manage project specifications, drawings, vendor submittals, and supporting documents."
        action={
          <Button onClick={upload.open}>
            <UploadCloud aria-hidden="true" />
            Upload Documents
          </Button>
        }
      />
      <UploadDropzone
        documentType={upload.documentType}
        onDocumentTypeChange={upload.setDocumentType}
        getRootProps={upload.getRootProps}
        getInputProps={upload.getInputProps}
        isDragActive={upload.isDragActive}
        open={upload.open}
        queue={upload.queue}
        onDismissItem={upload.dismissItem}
      />

      {isLoading ? (
        <DocumentsSkeleton />
      ) : isError ? (
        <EmptyState
          icon={TriangleAlert}
          title="Couldn't load documents"
          description="Something went wrong fetching this project's documents. Check your connection and try again."
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      ) : (
        <div className="space-y-8">
          <DocumentSection
            title="Specifications"
            icon={Files}
            documents={specifications}
            emptyTitle="No specifications uploaded"
            emptyDescription="Upload project specifications to begin AI-assisted compliance reviews."
          />
          <DocumentSection
            title="Drawings"
            icon={Ruler}
            documents={drawings}
            emptyTitle="No drawings uploaded"
            emptyDescription="Upload architectural, structural, and MEP drawings for this project."
          />
          <DocumentSection
            title="Vendor Submittals"
            icon={ClipboardList}
            documents={submittals}
            emptyTitle="No vendor submittals uploaded"
            emptyDescription="Upload vendor submittals to review them against project specifications."
          />
          <DocumentSection
            title="Other Documents"
            icon={FolderOpen}
            documents={other}
            emptyTitle="No other documents uploaded"
            emptyDescription="Upload RFIs, meeting notes, and other supporting project documents."
          />
        </div>
      )}
    </div>
  );
}
