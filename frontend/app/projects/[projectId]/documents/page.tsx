import { DocumentsWorkspace } from "@/components/documents/documents-workspace";

export default async function ProjectDocumentsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <DocumentsWorkspace projectId={projectId} />;
}
