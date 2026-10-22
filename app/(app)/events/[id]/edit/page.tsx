import { Suspense } from "react";

async function EventEditContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <>이벤트 수정: {id} (TODO: Task 004)</>;
}

export default function EventEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <Suspense>
        <EventEditContent params={params} />
      </Suspense>
    </div>
  );
}
