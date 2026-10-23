"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  EventForm,
  type EventCoverChange,
  type EventFormValues,
} from "@/components/events/event-form";
import { uploadEventCover } from "@/lib/storage/event-cover";
import { createClient } from "@/lib/supabase/client";

function toDatetimeLocalValue(iso: string) {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EventEditForm({
  eventId,
  defaultValues,
  defaultCoverImageUrl,
}: {
  eventId: string;
  defaultValues: {
    title: string;
    description?: string;
    location: string;
    eventDate: string;
  };
  defaultCoverImageUrl?: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(
    values: EventFormValues,
    cover: EventCoverChange,
  ) {
    let coverImageUrl: string | null | undefined = undefined;

    if (cover.file) {
      try {
        coverImageUrl = await uploadEventCover(supabase, eventId, cover.file);
      } catch {
        toast.error("커버 이미지 업로드에 실패했습니다");
        return;
      }
    } else if (cover.remove) {
      coverImageUrl = null;
    }

    const { error } = await supabase
      .from("events")
      .update({
        title: values.title,
        description: values.description || null,
        location: values.location,
        event_date: new Date(values.eventDate).toISOString(),
        ...(coverImageUrl !== undefined
          ? { cover_image_url: coverImageUrl }
          : {}),
      })
      .eq("id", eventId);

    if (error) {
      toast.error("수정에 실패했습니다");
      return;
    }

    toast.success("수정 완료되었습니다");
    router.push(`/events/${eventId}`);
  }

  return (
    <EventForm
      mode="edit"
      defaultValues={{
        ...defaultValues,
        eventDate: toDatetimeLocalValue(defaultValues.eventDate),
      }}
      defaultCoverImageUrl={defaultCoverImageUrl}
      onSubmitSuccess={handleSubmit}
    />
  );
}
