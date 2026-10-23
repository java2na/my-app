"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { uploadAvatar, validateAvatarFile } from "@/lib/storage/avatar";
import { createClient } from "@/lib/supabase/client";

export function ProfileAvatarEditor({
  userId,
  initialAvatarUrl,
  fallbackText,
}: {
  userId: string;
  initialAvatarUrl: string | null;
  fallbackText: string;
}) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const validationError = validateAvatarFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUploading(true);
    const supabase = createClient();
    try {
      const publicUrl = await uploadAvatar(supabase, userId, file);
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (error) throw error;

      setAvatarUrl(publicUrl);
      toast.success("프로필 사진이 변경되었습니다");
      router.refresh();
    } catch {
      toast.error("프로필 사진 업로드에 실패했습니다");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={isUploading}
      className="focus-visible:outline-ring relative rounded-full focus-visible:outline-2 disabled:opacity-60"
      aria-label="프로필 사진 변경"
    >
      <Avatar size="lg">
        {avatarUrl && <AvatarImage src={avatarUrl} alt={fallbackText} />}
        <AvatarFallback>{fallbackText}</AvatarFallback>
      </Avatar>
      <AvatarBadge>
        <Camera className="size-2" />
      </AvatarBadge>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />
    </button>
  );
}
