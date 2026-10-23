import {
  CalendarIcon,
  CalendarRangeIcon,
  CalendarDaysIcon,
  LayoutGridIcon,
  UserPlusIcon,
  UsersRoundIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { MetricCard } from "@/components/admin/metric-card";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminDashboardMetrics } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/supabase/require-admin";

const QUICK_LINKS = [
  { href: "/admin/events", label: "이벤트 관리" },
  { href: "/admin/users", label: "사용자 관리" },
  { href: "/admin/analytics", label: "통계 분석" },
] as const;

async function DashboardMetrics() {
  // "오늘" 기준 집계는 요청 시점의 현재 시각에 의존하므로 프리렌더링 대상에서 제외한다.
  await connection();
  await requireAdmin();
  const metrics = await getAdminDashboardMetrics();

  const metricCards = [
    {
      label: "오늘 생성된 이벤트",
      value: metrics.eventsToday,
      icon: CalendarIcon,
    },
    {
      label: "이번 주 생성된 이벤트",
      value: metrics.eventsThisWeek,
      icon: CalendarRangeIcon,
    },
    {
      label: "이번 달 생성된 이벤트",
      value: metrics.eventsThisMonth,
      icon: CalendarDaysIcon,
    },
    {
      label: "전체 이벤트 수",
      value: metrics.eventsTotal,
      icon: LayoutGridIcon,
    },
    {
      label: "오늘 가입한 사용자",
      value: metrics.usersToday,
      icon: UserPlusIcon,
    },
    {
      label: "이번 주 가입한 사용자",
      value: metrics.usersThisWeek,
      icon: UsersRoundIcon,
    },
    { label: "전체 사용자 수", value: metrics.usersTotal, icon: UserIcon },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metricCards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </div>
  );
}

function DashboardMetricsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 7 }, (_, index) => (
        <Skeleton key={index} className="h-24 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">대시보드</h1>

      <Suspense fallback={<DashboardMetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {QUICK_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:bg-accent transition-colors">
              <CardContent className="flex items-center justify-between py-4">
                <CardTitle className="text-base">{link.label}</CardTitle>
                <span className="text-muted-foreground">→</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
