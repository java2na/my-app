"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function adminDeleteUser(
  userId: string,
): Promise<{ error?: string }> {
  const { userId: adminId } = await requireAdmin();

  if (userId === adminId) {
    return { error: "본인 계정은 삭제할 수 없습니다." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/events");
  revalidatePath("/admin/dashboard");
  return {};
}
