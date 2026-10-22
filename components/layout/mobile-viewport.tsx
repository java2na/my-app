/**
 * 주최자/참여자 모바일 퍼스트 화면을 감싸는 공통 래퍼.
 * 데스크톱 브라우저에서는 모바일 기기 폭(430px)으로 가운데 정렬하고,
 * 실제 모바일 뷰포트에서는 폭 제한이 걸리지 않아 그대로 전체 화면으로 보인다.
 *
 * `footer`(하단 내비게이션 바 등)는 스크롤 영역 바깥의 일반 flex 항목으로 배치되므로,
 * `position: fixed` 없이도 프레임 폭 안에서 항상 하단에 고정된 것처럼 보인다.
 */
export function MobileViewport({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full justify-center bg-muted/40">
      <div className="flex h-full w-full max-w-[430px] flex-col bg-background sm:shadow-xl">
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer}
      </div>
    </div>
  );
}
