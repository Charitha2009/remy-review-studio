import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

/** Non-functional placeholder per Sprint 1 scope; wired up to real search in Sprint 5 (FR-8). */
export function GlobalSearch() {
  return (
    <div className="relative hidden w-full max-w-sm md:block">
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <label htmlFor="global-search" className="sr-only">
        Search projects, specifications, and drawings
      </label>
      <Input
        id="global-search"
        type="search"
        placeholder="Search projects, specifications, drawings…"
        className="pl-8"
      />
    </div>
  );
}
