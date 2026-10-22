import { Suspense } from "react";

async function JoinContent({
  params,
}: {
  params: Promise<{ invite_code: string }>;
}) {
  const { invite_code } = await params;
  return (
    <>
      초대 코드: {invite_code} (TODO: Task 009/010 — 이벤트 미리보기, 로그인
      유도, 자동 참여)
    </>
  );
}

export default function JoinPage({
  params,
}: {
  params: Promise<{ invite_code: string }>;
}) {
  return (
    <div>
      <Suspense>
        <JoinContent params={params} />
      </Suspense>
    </div>
  );
}
