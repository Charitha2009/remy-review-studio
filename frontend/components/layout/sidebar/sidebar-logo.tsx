import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function SidebarLogo() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-semibold text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <ShieldCheck className="size-4" aria-hidden="true" />
      </span>
      <span className="truncate">Remy Review Studio</span>
    </Link>
  );
}
