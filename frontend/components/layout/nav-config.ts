import {
  FolderKanban,
  LayoutDashboard,
  Library,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/**
 * Global nav only — things that make sense with no project selected. Documents,
 * AI Review, and Exports live inside the Project Workspace (FR-2.5 scopes them
 * to a project); Knowledge stays global since it's organizational memory
 * (company standards, approved substitutions), not just per-project search.
 */
export const primaryNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Knowledge", href: "/knowledge", icon: Library },
  { label: "Settings", href: "/settings", icon: Settings },
];
