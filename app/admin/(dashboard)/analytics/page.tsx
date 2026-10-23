import { connection } from "next/server";
import { Suspense } from "react";

import { AnalyticsView } from "@/components/admin/analytics-view";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAdminEventRows,
  getAdminUserRows,
  getEventTrend,
  getUserTrend,
} from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/supabase/require-admin";
import type { ChartPoint } from "@/lib/types/components";

type Period = "7" | "30" | "90";

const PERIODS = [7, 30, 90] as const;

async function AnalyticsData() {
  // 추이 집계는 요청 시점의 현재 날짜에 의존하므로 프리렌더링 대상에서 제외한다.
  await connection();
  await requireAdmin();

  const trendsByPeriodEntries = await Promise.all(
    PERIODS.map(
      async (days) =>
        [
          String(days),
          {
            events: await getEventTrend(days),
            users: await getUserTrend(days),
          },
        ] as const,
    ),
  );
  const trendsByPeriod = Object.fromEntries(trendsByPeriodEntries) as Record<
    Period,
    { events: ChartPoint[]; users: ChartPoint[] }
  >;

  const eventRows = await getAdminEventRows();
  const userRows = await getAdminUserRows();
  const avgParticipants =
    eventRows.length === 0
      ? 0
      : Math.round(
          (eventRows.reduce((sum, row) => sum + row.participantCount, 0) /
            eventRows.length) *
            10,
        ) / 10;

  const summary = {
    totalEvents: eventRows.length,
    totalUsers: userRows.length,
    avgParticipants,
  };

  return <AnalyticsView trendsByPeriod={trendsByPeriod} summary={summary} />;
}

function AnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">통계 분석</h1>
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsData />
      </Suspense>
    </div>
  );
}
