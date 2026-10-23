"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  EventForm,
  type EventFormValues,
} from "@/components/events/event-form";
import { DUMMY_EVENTS } from "@/lib/dummy-data";

export function EventNewForm() {
  const router = useRouter();

  function handleSubmit(values: EventFormValues) {
    // TODO(Task 009): 실제 Supabase 이벤트 생성 API 연동 — 지금은 제출값을 저장하지 않는다.
    void values;
    toast.success("이벤트가 생성되었습니다");
    router.push(`/events/${DUMMY_EVENTS[0].id}`);
  }

  return <EventForm mode="create" onSubmitSuccess={handleSubmit} />;
}
