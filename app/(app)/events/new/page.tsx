import { redirect } from "next/navigation";
import { Suspense } from "react";

import { EventNewForm } from "@/components/events/event-new-form";
import { createClient } from "@/lib/supabase/server";

async function EventNewContent() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const currentUserId = data?.claims?.sub;

  if (!currentUserId) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold">이벤트 생성</h1>
      <EventNewForm currentUserId={currentUserId} />
    </div>
  );
}

export default function EventNewPage() {
  return (
    <Suspense>
      <EventNewContent />
    </Suspense>
  );
}
