import { EventTable } from "@/components/admin/event-table";
import { getAdminEventRows } from "@/lib/dummy-data";

export default function AdminEventsPage() {
  const rows = getAdminEventRows();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">이벤트 관리</h1>
      <EventTable rows={rows} />
    </div>
  );
}
