"use client";

import type { ReactNode } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartPoint } from "@/lib/types/components";

function formatDate(date: string) {
  const [, month, day] = date.split("-");
  return `${month}/${day}`;
}

function formatTooltipLabel(label: ReactNode) {
  return typeof label === "string" ? formatDate(label) : label;
}

export function TrendLineChart({
  title,
  data,
}: {
  title: string;
  data: ChartPoint[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              className="text-xs"
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              allowDecimals={false}
              className="text-xs"
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip labelFormatter={formatTooltipLabel} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
