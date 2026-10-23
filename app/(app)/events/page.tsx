import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { EventCard } from "@/components/common/event-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDemoViewerRole } from "@/lib/demo-role";
import {
  DUMMY_EVENTS,
  getDummyParticipantsWithProfiles,
} from "@/lib/dummy-data";
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
  const role = await getDemoViewerRole();
  const isHost = role === "host";
  // 더미 데이터 한계: '내가 참여한' 필터링은 Task 010에서 실제 참여 데이터로 구현
  const events = status
    ? DUMMY_EVENTS.filter((event) => event.status === status)
    : DUMMY_EVENTS;

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold">
        {isHost ? "내 이벤트" : "참여 중인 이벤트"}
      </h1>

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

      {events.length === 0 ? (
        <EmptyState
          title={
            isHost ? "아직 이벤트가 없어요" : "아직 참여 중인 이벤트가 없어요"
          }
          description={
            isHost
              ? "새 이벤트를 만들어 참여자를 초대해보세요."
              : "초대 링크를 받으면 이벤트에 참여할 수 있어요."
          }
          action={
            isHost ? (
              <Button asChild>
                <Link href="/events/new">+ 새 이벤트 만들기</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        events.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`}>
            <EventCard
              event={event}
              participantCount={
                getDummyParticipantsWithProfiles(event.id).length
              }
            />
          </Link>
        ))
      )}

      {isHost && (
        <Link
          href="/events/new"
          aria-label="새 이벤트 만들기"
          className="sticky bottom-4 ml-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
        >
          <PlusIcon className="size-6" />
        </Link>
      )}
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
