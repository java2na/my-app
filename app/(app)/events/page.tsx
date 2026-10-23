import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { EventCard } from "@/components/common/event-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMyEvents, getParticipantCounts } from "@/lib/events-queries";
import { createClient } from "@/lib/supabase/server";
import type { EventStatus } from "@/lib/types/event";

const STATUS_TABS: { label: string; value?: EventStatus }[] = [
  { label: "전체" },
  { label: "예정", value: "upcoming" },
  { label: "진행 중", value: "ongoing" },
  { label: "종료", value: "ended" },
];

async function EventsListContent({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  const myEvents = userId ? await getMyEvents(userId) : [];
  const filtered = status
    ? myEvents.filter((entry) => entry.event.status === status)
    : myEvents;

  const createdEvents = filtered
    .filter((entry) => entry.role === "host")
    .map((entry) => entry.event);
  const joinedEvents = filtered
    .filter((entry) => entry.role === "participant")
    .map((entry) => entry.event);

  const participantCounts = await getParticipantCounts(
    filtered.map((entry) => entry.event.id),
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold">이벤트</h1>

      <div className="flex gap-2">
        {STATUS_TABS.map((tab) => {
          const href = tab.value ? `/events?status=${tab.value}` : "/events";
          const isActive = status === tab.value;

          return (
            <Link key={tab.label} href={href}>
              <Badge variant={isActive ? "default" : "outline"}>
                {tab.label}
              </Badge>
            </Link>
          );
        })}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-muted-foreground text-sm font-medium">
          내가 만든 이벤트
        </h2>
        {createdEvents.length === 0 ? (
          <EmptyState
            title="아직 만든 이벤트가 없어요"
            description="새 이벤트를 만들어 참여자를 초대해보세요."
            action={
              <Button asChild>
                <Link href="/events/new">+ 새 이벤트 만들기</Link>
              </Button>
            }
          />
        ) : (
          createdEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <EventCard
                event={event}
                participantCount={participantCounts.get(event.id) ?? 0}
              />
            </Link>
          ))
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-muted-foreground text-sm font-medium">
          참여한 이벤트
        </h2>
        {joinedEvents.length === 0 ? (
          <EmptyState
            title="아직 참여 중인 이벤트가 없어요"
            description="초대 링크를 받으면 이벤트에 참여할 수 있어요."
          />
        ) : (
          joinedEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <EventCard
                event={event}
                participantCount={participantCounts.get(event.id) ?? 0}
              />
            </Link>
          ))
        )}
      </section>

      <Link
        href="/events/new"
        aria-label="새 이벤트 만들기"
        className="bg-primary text-primary-foreground sticky bottom-4 ml-auto flex size-12 items-center justify-center rounded-full shadow-lg"
      >
        <PlusIcon className="size-6" />
      </Link>
    </div>
  );
}

export default function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  return (
    <Suspense>
      <EventsListContent searchParams={searchParams} />
    </Suspense>
  );
}
