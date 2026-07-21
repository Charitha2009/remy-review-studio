import { MobileSidebar } from "@/components/layout/sidebar/mobile-sidebar";
import { ProjectSwitcher } from "@/components/layout/top-nav/project-switcher";
import { GlobalSearch } from "@/components/layout/top-nav/global-search";
import { NotificationButton } from "@/components/layout/top-nav/notification-button";
import { UserMenu } from "@/components/layout/top-nav/user-menu";

export function TopNav() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      <MobileSidebar />
      <ProjectSwitcher />
      <GlobalSearch />
      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        <NotificationButton />
        <UserMenu />
      </div>
    </header>
  );
}
