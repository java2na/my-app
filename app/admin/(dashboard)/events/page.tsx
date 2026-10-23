import { Suspense } from "react";

import { EventTable } from "@/components/admin/event-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminEventRows } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/supabase/require-admin";

async function EventsData() {
  await requireAdmin();
  const rows = await getAdminEventRows();
  return <EventTable rows={rows} />;
}

function EventsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}

export default function AdminEventsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">이벤트 관리</h1>
      <Suspense fallback={<EventsSkeleton />}>
        <EventsData />
      </Suspense>
    </div>
  );
}
