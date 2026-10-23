import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import Image from "next/image";

import { EventStatusBadge } from "@/components/common/event-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EventCardProps } from "@/lib/types/components";
import { cn } from "@/lib/utils";

function formatEventDate(eventDate: string) {
  return new Date(eventDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function EventCard({
  event,
  participantCount,
  className,
}: EventCardProps & { className?: string }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative aspect-video w-full bg-muted">
        {event.coverImageUrl ? (
          <Image
            src={event.coverImageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            커버 이미지 없음
          </div>
        )}
      </div>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
        <EventStatusBadge status={event.status} />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4 shrink-0" />
          <span>{formatEventDate(event.eventDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPinIcon className="size-4 shrink-0" />
          <span className="line-clamp-1">{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <UsersIcon className="size-4 shrink-0" />
          <span>참여자 {participantCount}명</span>
        </div>
      </CardContent>
    </Card>
  );
}
