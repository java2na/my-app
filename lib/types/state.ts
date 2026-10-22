// 임시 타입 — Task 007에서 실제 DB 스키마 타입(lib/supabase/database.types.ts)으로 교체 예정
// 전역 상태 관리 라이브러리는 아직 선택되지 않음(Phase 2에서 결정) — 형태만 임시로 정의

import type { Event } from "./event";
import type { UserProfile } from "./user";

export interface AppState {
  currentUser: UserProfile | null;
  events: Event[];
}
