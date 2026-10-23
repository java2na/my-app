import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleLoginButton } from "@/components/google-login-button";

export default function AdminLoginPage() {
  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <p className="text-muted-foreground text-sm font-semibold">
            Gather Admin
          </p>
          <CardTitle className="text-xl">관리자 로그인</CardTitle>
          <CardDescription>
            관리자 계정으로 로그인해주세요. 일반 사용자는 접근할 수 없습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleLoginButton next="/admin/dashboard" />
        </CardContent>
      </Card>
    </main>
  );
}
