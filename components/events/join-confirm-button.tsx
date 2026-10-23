"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function JoinConfirmButton({ eventId }: { eventId: string }) {
  const router = useRouter();

  function handleConfirm() {
    // TODO(Task 010): 실제 Supabase 참여 처리(event_participants insert) 연동
    toast.success("참여가 완료되었습니다");
    router.push(`/events/${eventId}`);
  }

  return (
    <Button type="button" className="w-full" onClick={handleConfirm}>
      참여 확인
    </Button>
  );
}
