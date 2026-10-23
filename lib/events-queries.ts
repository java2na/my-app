// 서버 전용 읽기 쿼리 모음. lib/supabase/server.ts의 쿠키 기반 클라이언트를 사용하므로
// Server Component/Route Handler에서만 호출한다 (클라이언트 컴포넌트에서는 쓰기만
// lib/supabase/client.ts로 직접 호출하고, 읽기는 서버에서 내려준 props를 쓴다).

import { createClient } from "@/lib/supabase/server";
import { toEvent, type Event, type EventStatus } from "@/lib/types/event";
import {
  toEventParticipant,
  type EventParticipant,
  type ParticipantRole,
} from "@/lib/types/participant";
import { toUserProfile, type UserProfile } from "@/lib/types/user";

export async function getEvents(status?: EventStatus): Promise<Event[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (!data) return [];

  const events = data.map((row) => toEvent(row));
  return status ? events.filter((event) => event.status === status) : events;
}

export async function getParticipantCounts(
  eventIds: string[],
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (eventIds.length === 0) return counts;

  const supabase = await createClient();
  const { data } = await supabase
    .from("event_participants")
    .select("event_id")
    .in("event_id", eventIds);

  for (const row of data ?? []) {
    counts.set(row.event_id, (counts.get(row.event_id) ?? 0) + 1);
  }
  return counts;
}

export async function getEventById(id: string): Promise<Event | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data ? toEvent(data) : null;
}

export async function getEventByInviteCode(
  code: string,
): Promise<Event | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("invite_code", code)
    .maybeSingle();

  return data ? toEvent(data) : null;
}

export async function getEventParticipantsWithProfiles(
  eventId: string,
): Promise<{ participant: EventParticipant; profile: UserProfile }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("event_participants")
    .select("*, profiles(*)")
    .eq("event_id", eventId)
    .order("joined_at", { ascending: true });

  if (!data) return [];

  return data
    .filter((row) => row.profiles !== null)
    .map((row) => ({
      participant: toEventParticipant(row),
      profile: toUserProfile(row.profiles!),
    }));
}

export async function getEventHostProfile(
  hostUserId: string,
): Promise<UserProfile | null> {
  // event_participants의 select RLS(private.is_event_member)는 해당 이벤트 멤버만
  // 조회를 허용하므로, 아직 참여하지 않은 방문자가 보는 /join 페이지에서 조회하면
  // 항상 비어 있는 결과가 돈다. profiles는 누구나 조회 가능한 테이블이므로
  // events.created_by를 바로 profiles.id로 조회해 RLS 제약을 피한다.
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", hostUserId)
    .maybeSingle();

  return data ? toUserProfile(data) : null;
}

export async function isEventParticipant(
  eventId: string,
  userId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("event_participants")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle();

  return !!data;
}

export async function getMyEvents(
  userId: string,
): Promise<{ event: Event; role: ParticipantRole }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("event_participants")
    .select("role, events(*)")
    .eq("user_id", userId);

  if (!data) return [];

  return data
    .filter((row) => row.events !== null)
    .map((row) => ({
      event: toEvent(row.events!),
      role: row.role as ParticipantRole,
    }));
}
