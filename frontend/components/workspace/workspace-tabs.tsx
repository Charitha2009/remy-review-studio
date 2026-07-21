"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const workspaceTabs = [
  { label: "Overview", segment: "overview" },
  { label: "Documents", segment: "documents" },
  { label: "Reviews", segment: "reviews" },
  { label: "Reports", segment: "reports" },
] as const;

export function WorkspaceTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Project workspace"
      className="flex gap-4 border-b border-border"
    >
      {workspaceTabs.map((tab) => {
        const href = `/projects/${projectId}/${tab.segment}`;
        const isActive =
          pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={tab.segment}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 px-0.5 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
