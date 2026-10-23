"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const UNIQUE_VIOLATION = "23505";

export function JoinConfirmButton({
  eventId,
  userId,
}: {
  eventId: string;
  userId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleConfirm() {
    setIsSubmitting(true);

    const { error } = await supabase.from("event_participants").insert({
      event_id: eventId,
      user_id: userId,
      role: "participant",
    });

    if (error && error.code !== UNIQUE_VIOLATION) {
      toast.error("참여 처리 중 문제가 발생했습니다");
      setIsSubmitting(false);
      return;
    }

    toast.success(
      error ? "이미 참여 중인 이벤트입니다" : "참여가 완료되었습니다",
    );
    router.push(`/events/${eventId}`);
  }

  return (
    <Button
      type="button"
      className="w-full"
      onClick={handleConfirm}
      disabled={isSubmitting}
    >
      참여 확인
    </Button>
  );
}
