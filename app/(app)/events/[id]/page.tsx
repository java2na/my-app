import { CalendarIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { EventStatusBadge } from "@/components/common/event-status-badge";
import { CopyInviteLinkButton } from "@/components/events/copy-invite-link-button";
import { DeleteEventDialog } from "@/components/events/delete-event-dialog";
import { LeaveEventButton } from "@/components/events/leave-event-button";
import { LiveParticipantList } from "@/components/events/live-participant-list";
import { Button } from "@/components/ui/button";
import {
  getEventById,
  getEventParticipantsWithProfiles,
} from "@/lib/events-queries";
import { createClient } from "@/lib/supabase/server";

async function EventDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  const isHost = userId === event.createdBy;

  const eventDate = new Date(event.eventDate).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const participants = await getEventParticipantsWithProfiles(event.id);
  const isParticipant = participants.some(
    (entry) => entry.participant.userId === userId,
  );

  return (
    <div className="flex flex-col gap-6 p-4">
      {event.coverImageUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image
            src={event.coverImageUrl}
            alt={event.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <h1 className="text-xl font-semibold">{event.title}</h1>
        <EventStatusBadge status={event.status} />
      </div>

      <div className="text-muted-foreground flex flex-col gap-2 text-sm">
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
        <p className="text-foreground text-sm">{event.description}</p>
      )}

      {isHost && (
        <div className="flex flex-wrap gap-2">
          <CopyInviteLinkButton inviteCode={event.inviteCode} />
          <Button
            type="button"
            variant="outline"
            disabled
            title="카카오톡 공유는 추후 지원됩니다"
          >
            카카오톡 공유
          </Button>
        </div>
      )}

      <LiveParticipantList
        eventId={event.id}
        initialParticipants={participants}
      />

      {isHost && (
        <div className="flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/events/${event.id}/edit`}>이벤트 수정</Link>
          </Button>
          <DeleteEventDialog eventId={event.id} />
        </div>
      )}

      {!isHost && isParticipant && userId && (
        <LeaveEventButton eventId={event.id} userId={userId} />
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
