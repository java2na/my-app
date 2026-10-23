"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function adminDeleteEvent(
  eventId: string,
): Promise<{ error?: string }> {
  await requireAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/events");
  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");
  return {};
}
