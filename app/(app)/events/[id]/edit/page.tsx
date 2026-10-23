import { notFound } from "next/navigation";
import { Suspense } from "react";

import { EventEditForm } from "@/components/events/event-edit-form";
import { getEventById } from "@/lib/events-queries";
import { createClient } from "@/lib/supabase/server";

async function EventEditContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isHost = data?.claims?.sub === event.createdBy;

  if (!isHost) {
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
        defaultCoverImageUrl={event.coverImageUrl}
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
