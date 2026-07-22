import { UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";

/** UI-only dropzone — no drag-and-drop wiring or file picker yet; that lands with real upload support. */
export function UploadDropzone() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:border-primary/40 hover:bg-muted/50">
      <div className="flex size-10 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm">
        <UploadCloud className="size-5" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          Drag and drop files, or browse
        </p>
        <p className="text-xs text-muted-foreground">
          PDF, DWG, and image files up to 100&nbsp;MB
        </p>
      </div>
      <Button variant="outline" size="sm">
        Browse Files
      </Button>
    </div>
  );
}
