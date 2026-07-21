import { ClipboardList, FolderOpen, Ruler, UploadCloud, Files } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DocumentSection } from "@/components/documents/document-section";
import { UploadDropzone } from "@/components/documents/upload-dropzone";
import { PageHeader } from "@/components/shared/page-header";
import { getProjectDocuments } from "@/lib/placeholder-documents";

export default async function ProjectDocumentsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const documents = getProjectDocuments(projectId);

  const specifications = documents.filter((d) => d.type === "specification");
  const drawings = documents.filter((d) => d.type === "drawing");
  const submittals = documents.filter((d) => d.type === "submittal");
  const other = documents.filter((d) => d.type === "other");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Documents"
        description="Manage project specifications, drawings, vendor submittals, and supporting documents."
        action={
          <Button>
            <UploadCloud aria-hidden="true" />
            Upload Documents
          </Button>
        }
      />
      <UploadDropzone />
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
    </div>
  );
}
