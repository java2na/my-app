import { Suspense } from "react";

async function EventDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <>이벤트 상세: {id} (TODO: Task 004/005)</>;
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <Suspense>
        <EventDetailContent params={params} />
      </Suspense>
    </div>
  );
}
