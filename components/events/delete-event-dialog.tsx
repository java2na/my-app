"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";

export function DeleteEventDialog({ eventId }: { eventId: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleConfirm() {
    const { error } = await supabase.from("events").delete().eq("id", eventId);

    if (error) {
      toast.error("삭제에 실패했습니다");
      return;
    }

    toast.success("이벤트가 삭제되었습니다");
    router.push("/events");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive">
          이벤트 삭제
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>이벤트를 삭제하시겠습니까?</DialogTitle>
          <DialogDescription>
            삭제한 이벤트는 복구할 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              취소
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="destructive" onClick={handleConfirm}>
              삭제
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
