import { CalendarIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ParticipantCard } from "@/components/common/participant-card";
import { EventStatusBadge } from "@/components/common/event-status-badge";
import { CopyInviteLinkButton } from "@/components/events/copy-invite-link-button";
import { DeleteEventDialog } from "@/components/events/delete-event-dialog";
import { Button } from "@/components/ui/button";
import { getDemoViewerRole } from "@/lib/demo-role";
import {
  getDummyEventById,
  getDummyParticipantsWithProfiles,
} from "@/lib/dummy-data";

async function EventDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = getDummyEventById(id);

  if (!event) {
    notFound();
  }

  const role = await getDemoViewerRole();
  const isHost = role === "host";

  const eventDate = new Date(event.eventDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const participants = getDummyParticipantsWithProfiles(event.id);

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-xl font-semibold">{event.title}</h1>
        <EventStatusBadge status={event.status} />
      </div>

      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4 shrink-0" />
          <span>{eventDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPinIcon className="size-4 shrink-0" />
          <span>{event.location}</span>
        </div>
      </div>

      {event.description && (
        <p className="text-sm text-foreground">{event.description}</p>
      )}

      {isHost && (
        <div className="flex flex-wrap gap-2">
          <CopyInviteLinkButton inviteCode={event.inviteCode} />
          <Button
            type="button"
            variant="outline"
            disabled
            title="카카오톡 공유는 Task 009에서 지원 예정입니다"
          >
            카카오톡 공유
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          참여자 {participants.length}명
        </h2>
        <div className="flex flex-col divide-y">
          {participants.map(({ participant, profile }) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              profile={profile}
            />
          ))}
        </div>
      </div>

      {isHost && (
        <div className="flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/events/${event.id}/edit`}>이벤트 수정</Link>
          </Button>
          <DeleteEventDialog />
        </div>
      )}
    </div>
  );
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense>
      <EventDetailContent params={params} />
    </Suspense>
  );
}
