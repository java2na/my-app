import { UserTable } from "@/components/admin/user-table";
import { getAdminUserRows } from "@/lib/dummy-data";

export default function AdminUsersPage() {
  const rows = getAdminUserRows();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">사용자 관리</h1>
      <UserTable rows={rows} />
    </div>
  );
}
