import { CalendarCheckIcon, LinkIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { MobileViewport } from "@/components/layout/mobile-viewport";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";

const FEATURES = [
  {
    icon: CalendarCheckIcon,
    title: "간편한 이벤트 생성",
    description: "제목, 날짜, 장소만 입력하면 즉시 이벤트 생성",
  },
  {
    icon: LinkIcon,
    title: "원클릭 초대 시스템",
    description: "자동 생성된 초대 링크를 카카오톡으로 간편 공유",
  },
  {
    icon: UsersIcon,
    title: "실시간 참여자 관리",
    description: "Supabase Realtime으로 참여자 목록 자동 업데이트",
  },
] as const;

async function AuthCta() {
  if (!hasEnvVars) return null;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) return null;

  return (
    <Button asChild className="w-full">
      <Link href="/auth/login">로그인</Link>
    </Button>
  );
}

export default function Home() {
  return (
    <MobileViewport
      footer={
        <Suspense>
          <MobileBottomNav />
        </Suspense>
      }
    >
      <main className="flex min-h-full flex-col items-center">
        <div className="flex w-full flex-1 flex-col items-center pb-4">
          <div className="flex w-full flex-col items-center gap-2 p-5 pt-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Gather</h1>
            <p className="text-muted-foreground">
              초대 링크 하나로 모든 것을 해결하는
              <br />
              일회성 이벤트 관리 플랫폼
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-2 px-5 pt-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="text-center">
                <CardHeader className="flex flex-col items-center gap-2 p-3 pb-1">
                  <div className="bg-primary/10 flex size-9 items-center justify-center rounded-full">
                    <Icon className="text-primary size-5" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground p-3 pt-0 text-sm">
                  {description}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="w-full px-5 pt-6">
            <Suspense>
              <AuthCta />
            </Suspense>
          </div>

          <p className="text-muted-foreground px-5 pt-4 text-center text-xs">
            5-30명 규모의 소규모 이벤트를 위한 모바일 퍼스트 플랫폼
          </p>
        </div>
      </main>
    </MobileViewport>
  );
}
