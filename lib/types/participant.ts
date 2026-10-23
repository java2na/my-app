// Task 007: lib/supabase/database.types.ts의 event_participants 테이블 Row 타입에서
// 필드 타입을 가져온다. 필드명은 기존 UI 컴포넌트와의 호환을 위해 camelCase 유지.
// DB의 role 컬럼은 text + check(role in ('host','participant')) 제약으로 강제되므로
// 여기서는 좁힌 유니온 타입으로 다룬다.

import type { Tables } from "@/lib/supabase/database.types";

type EventParticipantRow = Tables<"event_participants">;

export type ParticipantRole = "host" | "participant";

export interface EventParticipant {
  id: EventParticipantRow["id"];
  eventId: EventParticipantRow["event_id"];
  userId: EventParticipantRow["user_id"];
  role: ParticipantRole;
  joinedAt: EventParticipantRow["joined_at"];
}

/**
 * event_participants 테이블 Row를 UI에서 쓰는 EventParticipant 뷰모델로 변환한다.
 * Task 010에서 실제 Supabase 쿼리 결과를 매핑할 때 사용한다.
 */
export function toEventParticipant(row: EventParticipantRow): EventParticipant {
  return {
    id: row.id,
    eventId: row.event_id,
    userId: row.user_id,
    role: row.role as ParticipantRole,
    joinedAt: row.joined_at,
  };
}
