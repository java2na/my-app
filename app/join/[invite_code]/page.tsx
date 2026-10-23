import { CalendarIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { EventStatusBadge } from "@/components/common/event-status-badge";
import { GoogleLoginButton } from "@/components/google-login-button";
import { JoinConfirmButton } from "@/components/events/join-confirm-button";
import { Button } from "@/components/ui/button";
import {
  getEventByInviteCode,
  getEventHostProfile,
  isEventParticipant,
} from "@/lib/events-queries";
import { createClient } from "@/lib/supabase/server";

async function JoinContent({
  params,
}: {
  params: Promise<{ invite_code: string }>;
}) {
  const { invite_code } = await params;
  const event = await getEventByInviteCode(invite_code);

  if (!event) {
    notFound();
  }

  const host = await getEventHostProfile(event.id);

  const eventDate = new Date(event.eventDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  const isLoggedIn = !!userId;
  const alreadyJoined = userId
    ? await isEventParticipant(event.id, userId)
    : false;

  return (
    <div className="flex flex-col gap-6 p-4">
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

      {host && (
        <p className="text-muted-foreground text-sm">
          주최자: {host.name ?? "이름 없음"}
        </p>
      )}

      {isLoggedIn && userId ? (
        alreadyJoined ? (
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm">
              이미 참여 중인 이벤트입니다.
            </p>
            <Button asChild className="w-full">
              <Link href={`/events/${event.id}`}>이벤트 보기</Link>
            </Button>
          </div>
        ) : (
          <JoinConfirmButton eventId={event.id} userId={userId} />
        )
      ) : (
        <GoogleLoginButton next={`/join/${invite_code}`} />
      )}
    </div>
  );
}

export default function JoinPage({
  params,
}: {
  params: Promise<{ invite_code: string }>;
}) {
  return (
    <div>
      <Suspense>
        <JoinContent params={params} />
      </Suspense>
    </div>
  );
}
