import { Settings } from "lucide-react";

import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function SettingsPage() {
  return (
    <PagePlaceholder
      title="Settings"
      description="Account and workspace preferences."
      emptyIcon={Settings}
      emptyTitle="Settings coming soon"
      emptyDescription="Account and workspace settings will be available in a future release."
    />
  );
}
