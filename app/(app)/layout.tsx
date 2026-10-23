import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { MobileViewport } from "@/components/layout/mobile-viewport";
import { getDemoViewerRole } from "@/lib/demo-role";
import { Suspense } from "react";

async function BottomNav() {
  const role = await getDemoViewerRole();
  return <MobileBottomNav role={role} />;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileViewport
      footer={
        <Suspense>
          <BottomNav />
        </Suspense>
      }
    >
      {children}
    </MobileViewport>
  );
}
