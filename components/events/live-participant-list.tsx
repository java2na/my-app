"use client";

import { useEffect, useState } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

import { ParticipantCard } from "@/components/common/participant-card";
import type { Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/client";
import {
  toEventParticipant,
  type EventParticipant,
} from "@/lib/types/participant";
import { toUserProfile, type UserProfile } from "@/lib/types/user";

type ParticipantRow = Tables<"event_participants">;

export function LiveParticipantList({
  eventId,
  initialParticipants,
}: {
  eventId: string;
  initialParticipants: {
    participant: EventParticipant;
    profile: UserProfile;
  }[];
}) {
  const [entries, setEntries] = useState(initialParticipants);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`event-participants-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "event_participants",
          filter: `event_id=eq.${eventId}`,
        },
        async (payload: RealtimePostgresChangesPayload<ParticipantRow>) => {
          if (payload.eventType === "INSERT") {
            const newRow = payload.new;
            const { data: profileRow } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", newRow.user_id)
              .single();

            if (!profileRow) return;

            setEntries((current) => {
              if (current.some((entry) => entry.participant.id === newRow.id)) {
                return current;
              }
              return [
                ...current,
                {
                  participant: toEventParticipant(newRow),
                  profile: toUserProfile(profileRow),
                },
              ];
            });
          } else if (payload.eventType === "DELETE") {
            const oldRow = payload.old;
            setEntries((current) =>
              current.filter((entry) => entry.participant.id !== oldRow.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-muted-foreground text-sm font-medium">
        참여자 {entries.length}명
      </h2>
      <div className="flex flex-col divide-y">
        {entries.map(({ participant, profile }) => (
          <ParticipantCard
            key={participant.id}
            participant={participant}
            profile={profile}
          />
        ))}
      </div>
    </div>
  );
}
