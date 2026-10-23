// 관리자 대시보드용 실제 Supabase 집계 쿼리. lib/dummy-data.ts의 더미 함수를 대체한다.
//
// event_participants의 RLS(private.is_event_member)는 "해당 이벤트 멤버만 참여자 목록을
// 볼 수 있다"는 일반 사용자 규칙이라, 관리자가 멤버가 아닌 이벤트의 참여자 수를 조회하면
// 쿠키 기반 클라이언트(lib/supabase/server.ts)로는 과소 집계된다. 그래서 이 모듈은
// lib/events-queries.ts를 재사용하지 않고 service_role 클라이언트(lib/supabase/admin.ts)로
// 직접 조회해 RLS 가시성 문제 없이 전체 데이터를 집계한다.

import { createAdminClient } from "@/lib/supabase/admin";
import { toEvent } from "@/lib/types/event";
import type {
  AdminDashboardMetrics,
  AdminEventRow,
  AdminUserRow,
  ChartPoint,
} from "@/lib/types/components";
import { toUserProfile } from "@/lib/types/user";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfUTCDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function isSameUTCDate(isoDate: string, date: Date): boolean {
  const target = new Date(isoDate);
  return (
    target.getUTCFullYear() === date.getUTCFullYear() &&
    target.getUTCMonth() === date.getUTCMonth() &&
    target.getUTCDate() === date.getUTCDate()
  );
}

async function countRows(
  table: "events" | "profiles",
  sinceIso?: string,
): Promise<number> {
  const supabase = createAdminClient();
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  if (sinceIso) {
    query = query.gte("created_at", sinceIso);
  }
  const { count } = await query;
  return count ?? 0;
}

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const now = new Date();
  const todayStartIso = startOfUTCDate(now).toISOString();
  const weekStartIso = new Date(now.getTime() - 7 * DAY_MS).toISOString();
  const monthStartIso = new Date(now.getTime() - 30 * DAY_MS).toISOString();

  const [
    eventsToday,
    eventsThisWeek,
    eventsThisMonth,
    eventsTotal,
    usersToday,
    usersThisWeek,
    usersTotal,
  ] = await Promise.all([
    countRows("events", todayStartIso),
    countRows("events", weekStartIso),
    countRows("events", monthStartIso),
    countRows("events"),
    countRows("profiles", todayStartIso),
    countRows("profiles", weekStartIso),
    countRows("profiles"),
  ]);

  return {
    eventsToday,
    eventsThisWeek,
    eventsThisMonth,
    eventsTotal,
    usersToday,
    usersThisWeek,
    usersTotal,
  };
}

export async function getAdminEventRows(): Promise<AdminEventRow[]> {
  const supabase = createAdminClient();
  const { data: eventRows } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  const events = (eventRows ?? []).map((row) => toEvent(row));
  if (events.length === 0) return [];

  const eventIds = events.map((event) => event.id);
  const hostIds = Array.from(new Set(events.map((event) => event.createdBy)));

  const [{ data: hostRows }, { data: participantRows }] = await Promise.all([
    supabase.from("profiles").select("id, full_name").in("id", hostIds),
    supabase
      .from("event_participants")
      .select("event_id")
      .in("event_id", eventIds),
  ]);

  const hostNameById = new Map(
    (hostRows ?? []).map((row) => [row.id, row.full_name ?? "이름 없음"]),
  );

  const participantCountByEvent = new Map<string, number>();
  for (const row of participantRows ?? []) {
    participantCountByEvent.set(
      row.event_id,
      (participantCountByEvent.get(row.event_id) ?? 0) + 1,
    );
  }

  return events.map((event) => ({
    event,
    hostName: hostNameById.get(event.createdBy) ?? "알 수 없음",
    participantCount: participantCountByEvent.get(event.id) ?? 0,
  }));
}

export async function getAdminUserRows(): Promise<AdminUserRow[]> {
  const supabase = createAdminClient();
  const [
    { data: profileRows },
    { data: eventRows },
    { data: participantRows },
  ] = await Promise.all([
    supabase.from("profiles").select("*"),
    supabase.from("events").select("created_by"),
    supabase.from("event_participants").select("user_id, role"),
  ]);

  const createdCountByUser = new Map<string, number>();
  for (const row of eventRows ?? []) {
    createdCountByUser.set(
      row.created_by,
      (createdCountByUser.get(row.created_by) ?? 0) + 1,
    );
  }

  const joinedCountByUser = new Map<string, number>();
  for (const row of participantRows ?? []) {
    if (row.role !== "participant") continue;
    joinedCountByUser.set(
      row.user_id,
      (joinedCountByUser.get(row.user_id) ?? 0) + 1,
    );
  }

  return (profileRows ?? []).map((row) => {
    const user = toUserProfile(row);
    return {
      user,
      createdEventCount: createdCountByUser.get(user.id) ?? 0,
      joinedEventCount: joinedCountByUser.get(user.id) ?? 0,
    };
  });
}

function buildTrend(
  items: { created_at: string }[],
  days: number,
): ChartPoint[] {
  const points: ChartPoint[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(Date.now() - i * DAY_MS);
    const count = items.filter((item) =>
      isSameUTCDate(item.created_at, date),
    ).length;
    points.push({ date: date.toISOString().slice(0, 10), count });
  }
  return points;
}

async function getCreatedAtSince(
  table: "events" | "profiles",
  days: number,
): Promise<{ created_at: string }[]> {
  const supabase = createAdminClient();
  const boundaryIso = new Date(Date.now() - days * DAY_MS).toISOString();
  const { data } = await supabase
    .from(table)
    .select("created_at")
    .gte("created_at", boundaryIso);
  return data ?? [];
}

export async function getEventTrend(days: number): Promise<ChartPoint[]> {
  const rows = await getCreatedAtSince("events", days);
  return buildTrend(rows, days);
}

export async function getUserTrend(days: number): Promise<ChartPoint[]> {
  const rows = await getCreatedAtSince("profiles", days);
  return buildTrend(rows, days);
}
