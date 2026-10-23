import { CalendarCheckIcon, LinkIcon, UsersIcon } from "lucide-react";
import { Suspense } from "react";

import { AuthButton } from "@/components/auth-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnvVarWarning } from "@/components/env-var-warning";
import { GoogleLoginButton } from "@/components/google-login-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
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

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex w-full flex-1 flex-col items-center gap-16">
        <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
          <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
            <span className="font-semibold">Gather</span>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>

        <div className="flex max-w-2xl flex-1 flex-col items-center gap-6 p-5 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Gather
          </h1>
          <p className="max-w-md text-muted-foreground">
            일회성 이벤트를 간편하게 관리하는 올인원 플랫폼 — 초대 링크 하나로
            모든 것을 해결
          </p>
          {hasEnvVars && <GoogleLoginButton />}
        </div>

        <div className="grid w-full max-w-4xl grid-cols-1 gap-4 p-5 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader className="flex flex-row items-center gap-2">
                <Icon className="size-5 text-primary" />
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>

        <footer className="mx-auto flex w-full items-center justify-center gap-8 border-t py-16 text-center text-xs">
          <p className="text-muted-foreground">
            5-30명 규모의 소규모 이벤트를 위한 모바일 퍼스트 플랫폼
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
