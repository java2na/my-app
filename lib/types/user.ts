// Task 007: lib/supabase/database.types.ts의 profiles 테이블 Row 타입에서 필드 타입을
// 가져온다. 필드명은 기존 UI 컴포넌트와의 호환을 위해 camelCase 유지(email/role 제외).
// profiles는 Supabase 스타터 킷 관례상 "users 테이블" 역할을 하며, role 컬럼은
// 20261023062709_profiles_add_role.sql에서 text + check(role in ('user','admin'))로 추가됨.

import type { Tables } from "@/lib/supabase/database.types";

type ProfileRow = Tables<"profiles">;

export type UserRole = "user" | "admin";

export interface UserProfile {
  id: ProfileRow["id"];
  email: ProfileRow["email"];
  name: ProfileRow["full_name"];
  avatarUrl: ProfileRow["avatar_url"];
  role: UserRole;
  createdAt: ProfileRow["created_at"];
}

/**
 * profiles 테이블 Row를 UI에서 쓰는 UserProfile 뷰모델로 변환한다.
 * Task 008/009/010에서 실제 Supabase 쿼리 결과를 매핑할 때 사용한다.
 */
export function toUserProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    name: row.full_name,
    avatarUrl: row.avatar_url,
    role: row.role as UserRole,
    createdAt: row.created_at,
  };
}
