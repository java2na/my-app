import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminMetricCardProps } from "@/lib/types/components";

export function MetricCard({ label, value, icon: Icon }: AdminMetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {label}
        </CardTitle>
        {Icon && <Icon className="text-muted-foreground size-4" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value.toLocaleString("ko-KR")}
        </div>
      </CardContent>
    </Card>
  );
}
