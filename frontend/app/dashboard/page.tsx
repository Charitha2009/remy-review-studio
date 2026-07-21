import { LayoutDashboard } from "lucide-react";

import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function DashboardPage() {
  return (
    <PagePlaceholder
      title="Dashboard"
      description="A summary of your projects and review activity."
      emptyIcon={LayoutDashboard}
      emptyTitle="No activity yet"
      emptyDescription="Create your first project to see review activity and status here."
    />
  );
}
