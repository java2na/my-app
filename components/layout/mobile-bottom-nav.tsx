"use client";

import { cn } from "@/lib/utils";
import { CalendarIcon, PlusIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/events", label: "내 이벤트", icon: CalendarIcon },
  { href: "/events/new", label: "새 이벤트", icon: PlusIcon },
  { href: "/profile", label: "프로필", icon: UserIcon },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex h-16 w-full shrink-0 border-t border-border bg-background">
      {TABS.map(({ href, label, icon: Icon }) => {
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
