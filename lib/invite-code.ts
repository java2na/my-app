// events.invite_code는 unique + 길이 체크(>=6)만 있고 DB default가 없다(Task 007에서
// 의도적으로 생성 로직을 Task 009로 미룸). 호출부에서 unique violation(23505) 시
// 재생성·재시도해야 한다.

export function generateInviteCode(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
}
