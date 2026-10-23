"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  EventForm,
  type EventCoverChange,
  type EventFormValues,
} from "@/components/events/event-form";
import { generateInviteCode } from "@/lib/invite-code";
import { uploadEventCover } from "@/lib/storage/event-cover";
import { createClient } from "@/lib/supabase/client";

const UNIQUE_VIOLATION = "23505";
const MAX_INVITE_CODE_ATTEMPTS = 5;

export function EventNewForm({ currentUserId }: { currentUserId: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(
    values: EventFormValues,
    cover: EventCoverChange,
  ) {
    let newEventId: string | null = null;

    for (let attempt = 0; attempt < MAX_INVITE_CODE_ATTEMPTS; attempt += 1) {
      const { data, error } = await supabase
        .from("events")
        .insert({
          title: values.title,
          description: values.description || null,
          location: values.location,
          event_date: new Date(values.eventDate).toISOString(),
          invite_code: generateInviteCode(),
          created_by: currentUserId,
        })
        .select("id")
        .single();

      if (!error) {
        newEventId = data.id;
        break;
      }

      if (error.code !== UNIQUE_VIOLATION) {
        toast.error("이벤트 생성에 실패했습니다");
        return;
      }
    }

    if (!newEventId) {
      toast.error("초대 코드 생성에 실패했습니다. 다시 시도해주세요");
      return;
    }

    if (cover.file) {
      try {
        const coverImageUrl = await uploadEventCover(
          supabase,
          newEventId,
          cover.file,
        );
        await supabase
          .from("events")
          .update({ cover_image_url: coverImageUrl })
          .eq("id", newEventId);
      } catch {
        toast.error("커버 이미지 업로드에 실패했습니다");
      }
    }

    toast.success("이벤트가 생성되었습니다");
    router.push(`/events/${newEventId}`);
  }

  return <EventForm mode="create" onSubmitSuccess={handleSubmit} />;
}
