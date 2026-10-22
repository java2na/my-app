import { MobileViewport } from "@/components/layout/mobile-viewport";

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileViewport>{children}</MobileViewport>;
}
