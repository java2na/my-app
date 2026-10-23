"use client";

import { cn } from "@/lib/utils";
import type { ViewerRole } from "@/lib/demo-role";
import { CalendarIcon, PlusIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function buildTabs(role: ViewerRole) {
  const tabs = [
    { href: "/events", label: "내 이벤트", icon: CalendarIcon },
    { href: "/events/new", label: "새 이벤트", icon: PlusIcon },
    { href: "/profile", label: "프로필", icon: UserIcon },
  ] as const;

  return role === "host"
    ? tabs
    : tabs.filter((tab) => tab.href !== "/events/new");
}

export function MobileBottomNav({ role }: { role: ViewerRole }) {
  const pathname = usePathname();
  const tabs = buildTabs(role);

  return (
    <nav className="flex h-16 w-full shrink-0 border-t border-border bg-background">
      {tabs.map(({ href, label, icon: Icon }) => {
        const isActive =
          pathname === href || (href === "/events" && pathname === "/");

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex min-h-12 flex-1 flex-col items-center justify-center gap-1 text-xs",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon size={22} strokeWidth={2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
