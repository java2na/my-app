import { notFound } from "next/navigation";
import { Suspense } from "react";

import { EventEditForm } from "@/components/events/event-edit-form";
import { getDummyEventById } from "@/lib/dummy-data";

async function EventEditContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = getDummyEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold">이벤트 수정</h1>
      <EventEditForm
        eventId={event.id}
        defaultValues={{
          title: event.title,
          description: event.description ?? undefined,
          location: event.location,
          eventDate: event.eventDate,
        }}
      />
    </div>
  );
}

export default function EventEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense>
      <EventEditContent params={params} />
    </Suspense>
  );
}
