import { Suspense } from "react";

import { UserTable } from "@/components/admin/user-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminUserRows } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/supabase/require-admin";

async function UsersData() {
  await requireAdmin();
  const rows = await getAdminUserRows();
  return <UserTable rows={rows} />;
}

function UsersSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">사용자 관리</h1>
      <Suspense fallback={<UsersSkeleton />}>
        <UsersData />
      </Suspense>
    </div>
  );
}
