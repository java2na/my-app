// avatars 버킷(공개 read, 본인 전용 write)에 프로필 사진을 업로드한다.
// 경로는 supabase/migrations/20261023140000_storage_avatars.sql의 RLS가
// storage.foldername(name)[1]을 auth.uid()와 비교하는 규칙을 따라 `<userId>/avatar.<ext>`로
// 고정한다(upsert로 재업로드 시 덮어씀).

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const BUCKET = "avatars";
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function validateAvatarFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "jpg, png, webp 형식의 이미지만 업로드할 수 있습니다";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "이미지 크기는 5MB 이하여야 합니다";
  }
  return null;
}

export async function uploadAvatar(
  supabase: SupabaseClient<Database>,
  userId: string,
  file: File,
): Promise<string> {
  const error = validateAvatarFile(file);
  if (error) {
    throw new Error(error);
  }

  const ext = EXTENSION_BY_TYPE[file.type];
  const path = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
