import { Suspense } from "react";

import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { MobileViewport } from "@/components/layout/mobile-viewport";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileViewport
      footer={
        <Suspense>
          <MobileBottomNav />
        </Suspense>
      }
    >
      {children}
    </MobileViewport>
  );
}
