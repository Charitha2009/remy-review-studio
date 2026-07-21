import type { LucideIcon } from "lucide-react";

import { DocumentCard } from "@/components/documents/document-card";
import { SectionHeader } from "@/components/documents/section-header";
import { EmptyState } from "@/components/shared/empty-state";
import type { ProjectDocument } from "@/types/document";

type DocumentSectionProps = {
  title: string;
  icon: LucideIcon;
  documents: ProjectDocument[];
  emptyTitle: string;
  emptyDescription: string;
};

export function DocumentSection({
  title,
  icon,
  documents,
  emptyTitle,
  emptyDescription,
}: DocumentSectionProps) {
  return (
    <section className="space-y-3">
      <SectionHeader title={title} count={documents.length} />
      {documents.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      ) : (
        <EmptyState icon={icon} title={emptyTitle} description={emptyDescription} />
      )}
    </section>
  );
}
