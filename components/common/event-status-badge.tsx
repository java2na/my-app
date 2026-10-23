import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { Event } from "@/lib/types";
import type { EventStatusBadgeProps } from "@/lib/types/components";

const STATUS_MAP: Record<
  Event["status"],
  { label: string; variant: BadgeProps["variant"] }
> = {
  upcoming: { label: "예정", variant: "outline" },
  ongoing: { label: "진행 중", variant: "default" },
  ended: { label: "종료", variant: "secondary" },
};

export function EventStatusBadge({ status }: EventStatusBadgeProps) {
  const { label, variant } = STATUS_MAP[status];
  return <Badge variant={variant}>{label}</Badge>;
}
