import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * lib/supabase/proxy.ts의 /admin/* role 체크와 동일한 기준(profiles.role === "admin")을
 * Server Component/Server Action에서도 재검증한다. 프록시가 페이지 네비게이션은
 * 걸러주지만, Server Action은 직접 호출될 수 있으므로 특히 삭제 액션에서는 필수 가드다.
 */
export async function requireAdmin(): Promise<{ userId: string }> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", claims.sub)
    .single();

  if (profile?.role !== "admin") {
    redirect("/admin/login");
  }

  return { userId: claims.sub };
}
