// Task 007: lib/supabase/database.types.ts의 events 테이블 Row 타입에서 필드 타입을
// 그대로 가져온다. 필드명은 기존 UI 컴포넌트/lib/dummy-data.ts와의 호환을 위해
// camelCase를 유지한다 (DB 컬럼은 snake_case, 예: event_date -> eventDate).
//
// status는 DB 컬럼이 아니다 — 단일 event_date만으로는 "진행 중" 구간을 저장할
// 방법이 없고(시작/종료 구간 없음), pg_cron 같은 스케줄러 없이 저장형 컬럼을 정확히
// 유지할 수 없기 때문에 조회 시점에 파생시키기로 결정했다(Task 007 스키마 설계 결정).

import type { Tables } from "@/lib/supabase/database.types";

type EventRow = Tables<"events">;

export type EventStatus = "upcoming" | "ongoing" | "ended";

export interface Event {
  id: EventRow["id"];
  title: EventRow["title"];
  description: EventRow["description"];
  location: EventRow["location"];
  eventDate: EventRow["event_date"];
  coverImageUrl: EventRow["cover_image_url"];
  inviteCode: EventRow["invite_code"];
  status: EventStatus;
  createdBy: EventRow["created_by"];
  createdAt: EventRow["created_at"];
  updatedAt: EventRow["updated_at"];
}

/**
 * event_date와 현재 시각을 비교해 이벤트 상태를 파생시킨다.
 * - upcoming: 이벤트 날짜가 오늘(UTC 기준)보다 미래
 * - ongoing: 이벤트 날짜가 오늘(UTC 기준)과 같은 날
 * - ended: 이벤트 날짜가 오늘(UTC 기준)보다 과거
 *
 * 더 정교한 시작/종료 구간이 필요해지면 이 함수만 교체하면 된다.
 */
export function computeEventStatus(
  eventDateIso: string,
  now: Date = new Date(),
): EventStatus {
  const target = new Date(eventDateIso);
  const startOfToday = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  const startOfTargetDay = Date.UTC(
    target.getUTCFullYear(),
    target.getUTCMonth(),
    target.getUTCDate(),
  );

  if (startOfTargetDay > startOfToday) return "upcoming";
  if (startOfTargetDay < startOfToday) return "ended";
  return "ongoing";
}

/**
 * events 테이블 Row를 UI에서 쓰는 Event 뷰모델로 변환한다.
 * Task 009/010에서 실제 Supabase 쿼리 결과를 매핑할 때 사용한다.
 */
export function toEvent(row: EventRow, now?: Date): Event {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    eventDate: row.event_date,
    coverImageUrl: row.cover_image_url,
    inviteCode: row.invite_code,
    status: computeEventStatus(row.event_date, now),
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
