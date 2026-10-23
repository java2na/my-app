import { CalendarIcon, MapPinIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { EventStatusBadge } from "@/components/common/event-status-badge";
import { GoogleLoginButton } from "@/components/google-login-button";
import { JoinConfirmButton } from "@/components/events/join-confirm-button";
import {
  getDummyEventByInviteCode,
  getDummyParticipantsWithProfiles,
} from "@/lib/dummy-data";
import { createClient } from "@/lib/supabase/server";

async function JoinContent({
  params,
}: {
  params: Promise<{ invite_code: string }>;
}) {
  const { invite_code } = await params;
  const event = getDummyEventByInviteCode(invite_code);

  if (!event) {
    notFound();
  }

  const host = getDummyParticipantsWithProfiles(event.id).find(
    (entry) => entry.participant.role === "host",
  );

  const eventDate = new Date(event.eventDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = !!data?.claims?.sub;

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

      {host && (
        <p className="text-sm text-muted-foreground">
          주최자: {host.profile.name ?? "이름 없음"}
        </p>
      )}

      {isLoggedIn ? (
        <JoinConfirmButton eventId={event.id} />
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
