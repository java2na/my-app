"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export function ProfileNameEditor({
  userId,
  initialName,
}: {
  userId: string;
  initialName: string;
}) {
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setIsSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name.trim() || null })
      .eq("id", userId);
    setIsSaving(false);

    if (error) {
      toast.error("이름을 저장하지 못했습니다");
      return;
    }

    toast.success("이름이 저장되었습니다");
    router.refresh();
  }

  return (
    <div className="flex w-full items-center gap-2">
      <Input
        value={name}
        onChange={(event) => setName(event.target.value)}
        maxLength={50}
        placeholder="이름을 입력하세요"
        className="text-center"
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleSave}
        disabled={isSaving}
      >
        저장
      </Button>
    </div>
  );
}
