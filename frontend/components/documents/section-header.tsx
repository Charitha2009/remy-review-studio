export function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {count > 0 ? (
        <span className="text-xs text-muted-foreground">
          {count} {count === 1 ? "document" : "documents"}
        </span>
      ) : null}
    </div>
  );
}
