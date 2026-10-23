// 데모 역할 토글 — 실제 인증/권한 시스템(Task 008/010)이 완성되기 전까지
// 호스트/참여자 UX를 같은 화면에서 전환해 볼 수 있게 하는 Phase 2 전용 장치.
// 쿠키가 없으면 기본값은 'host'(Task 004 기존 동작과 100% 호환).

import { cookies } from "next/headers";

export type ViewerRole = "host" | "participant";

export const DEMO_ROLE_COOKIE = "gather-demo-role";

export async function getDemoViewerRole(): Promise<ViewerRole> {
  const store = await cookies();
  return store.get(DEMO_ROLE_COOKIE)?.value === "participant"
    ? "participant"
    : "host";
}
