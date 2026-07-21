import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar/sidebar";
import { TopNav } from "@/components/layout/top-nav/top-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav />
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto p-6 focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
