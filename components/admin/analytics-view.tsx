"use client";

import { useState } from "react";

import { MetricCard } from "@/components/admin/metric-card";
import { TrendLineChart } from "@/components/admin/trend-line-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChartPoint } from "@/lib/types/components";

type Period = "7" | "30" | "90";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "7", label: "최근 7일" },
  { value: "30", label: "최근 30일" },
  { value: "90", label: "최근 90일" },
];

interface AnalyticsViewProps {
  trendsByPeriod: Record<Period, { events: ChartPoint[]; users: ChartPoint[] }>;
  summary: {
    totalEvents: number;
    totalUsers: number;
    avgParticipants: number;
  };
}

export function AnalyticsView({ trendsByPeriod, summary }: AnalyticsViewProps) {
  const [period, setPeriod] = useState<Period>("7");
  const trends = trendsByPeriod[period];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-3 gap-4">
          <MetricCard label="총 이벤트 수" value={summary.totalEvents} />
          <MetricCard label="총 사용자 수" value={summary.totalUsers} />
          <MetricCard label="평균 참여자 수" value={summary.avgParticipants} />
        </div>
        <Select
          value={period}
          onValueChange={(value) => setPeriod(value as Period)}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TrendLineChart title="이벤트 생성 추이" data={trends.events} />
        <TrendLineChart title="사용자 증가 추이" data={trends.users} />
      </div>
    </div>
  );
}
