"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button-variants";
import { SidebarNav } from "@/components/layout/sidebar/sidebar-nav";
import { SidebarLogo } from "@/components/layout/sidebar/sidebar-logo";
import { cn } from "@/lib/utils";

/**
 * Sheet-based nav drawer for small screens. Reuses `SidebarNav` so nav rendering isn't duplicated.
 * Uncontrolled and keyed on pathname: navigating remounts it, which resets its open state to closed
 * without a setState-in-effect.
 */
export function MobileSidebar() {
  const pathname = usePathname();

  return (
    <Sheet key={pathname}>
      <SheetTrigger
        aria-label="Open navigation menu"
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")}
      >
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border px-4 py-3">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <SidebarLogo />
        </SheetHeader>
        <div className="flex flex-1 flex-col overflow-y-auto py-4">
          <SidebarNav />
        </div>
      </SheetContent>
    </Sheet>
  );
}
