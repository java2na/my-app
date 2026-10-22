import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Suspense } from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Suspense>
        <AdminSidebar />
      </Suspense>
      <main className="flex-1 bg-muted/30 p-6">{children}</main>
    </div>
  );
}
