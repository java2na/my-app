import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

/**
 * 서버 전용 service_role 클라이언트 — RLS를 완전히 우회한다.
 * 절대 클라이언트 번들에 노출되면 안 되며, Server Action 내부에서
 * requireAdmin() 통과 후에만 사용한다. Fluid compute 환경을 고려해
 * 모듈 전역 싱글턴으로 두지 않고 매 호출마다 새로 생성한다.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      // next.config.ts의 cacheComponents(실험적 Cache Components) 하에서 Next.js가
      // 이 클라이언트의 내부 fetch() 호출을 Data Cache로 캐싱해, 관리자 대시보드
      // 집계(getAdminUserRows 등)가 삭제/생성 직후 새로 들어온 요청에서도 묵은 값을
      // 돌려주는 경우가 있었다. revalidatePath만으로는 이 fetch 단위 캐싱까지
      // 확실히 무효화되지 않으므로, 이 클라이언트가 보내는 모든 요청을 명시적으로
      // no-store로 못박아 항상 최신 데이터를 가져오도록 한다.
      global: {
        fetch: (url, init) => fetch(url, { ...init, cache: "no-store" }),
      },
    },
  );
}
