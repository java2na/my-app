// 임시 타입 — Task 007에서 실제 DB 스키마 타입(lib/supabase/database.types.ts)으로 교체 예정
// role은 PRD 스펙이며 profiles 테이블에는 아직 없음(shrimp-rules.md 참고)

export type UserRole = "user" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
}
