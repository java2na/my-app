"use client";

import { LinkIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function CopyInviteLinkButton({ inviteCode }: { inviteCode: string }) {
  async function handleCopy() {
    const url = `${window.location.origin}/join/${inviteCode}`;
    await navigator.clipboard.writeText(url);
    toast.success("초대 링크가 복사되었습니다");
  }

  return (
    <Button type="button" variant="outline" onClick={handleCopy}>
      <LinkIcon className="size-4" />
      초대 링크 복사
    </Button>
  );
}
