const KST_TIME_ZONE = "Asia/Seoul";

// Vercel 서버의 기본 타임존은 UTC다. timeZone을 명시하지 않으면 toLocaleString류가
// 서버 로컬 타임존(UTC) 기준으로 포맷되어 KST 사용자에게는 9시간 어긋나 보인다.
export function formatEventDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: KST_TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", {
    timeZone: KST_TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", {
    timeZone: KST_TIME_ZONE,
  });
}
