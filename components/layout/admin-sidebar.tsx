"use client";

import { LogoutButton } from "@/components/logout-button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  { href: "/admin/dashboard", label: "대시보드 메인" },
  { href: "/admin/events", label: "이벤트 관리" },
  { href: "/admin/users", label: "사용자 관리" },
  { href: "/admin/analytics", label: "통계 분석" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-background">
      <div className="flex h-16 items-center border-b border-border px-4 font-semibold">
        Gather Admin
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {MENU_ITEMS.map(({ href, label }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex h-12 items-center rounded-md px-4 text-sm",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-2">
        <LogoutButton />
      </div>
    </aside>
  );
}
