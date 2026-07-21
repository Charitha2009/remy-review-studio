import { SidebarLogo } from "@/components/layout/sidebar/sidebar-logo";
import { SidebarNav } from "@/components/layout/sidebar/sidebar-nav";

/** Fixed desktop sidebar. Hidden below `md`; see `MobileSidebar` for the small-screen equivalent. */
export function Sidebar() {
  return (
    <aside
      aria-label="Sidebar"
      className="hidden w-64 shrink-0 flex-col border-r border-border bg-background md:flex"
    >
      <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
        <SidebarLogo />
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto py-4">
        <SidebarNav />
      </div>
    </aside>
  );
}
