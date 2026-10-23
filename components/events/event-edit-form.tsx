"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  EventForm,
  type EventFormValues,
} from "@/components/events/event-form";

function toDatetimeLocalValue(iso: string) {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EventEditForm({
  eventId,
  defaultValues,
}: {
  eventId: string;
  defaultValues: {
    title: string;
    description?: string;
    location: string;
    eventDate: string;
  };
}) {
  const router = useRouter();

  function handleSubmit(values: EventFormValues) {
    // TODO(Task 009): 실제 Supabase 수정 API 연동 — 지금은 제출값을 저장하지 않는다.
    void values;
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
      onSubmitSuccess={handleSubmit}
    />
  );
}
