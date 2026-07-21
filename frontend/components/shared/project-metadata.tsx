import type { ReactNode } from "react";

type MetadataItem = {
  label: string;
  value: ReactNode;
};

/** Compact label/value grid for a project's (or any record's) key fields. */
export function ProjectMetadata({ items }: { items: MetadataItem[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs font-medium text-muted-foreground">
            {item.label}
          </dt>
          <dd className="mt-0.5 text-sm text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
