# 개발 가이드라인

이 문서는 이 저장소에서 작업하는 AI 에이전트를 위한 운영 규칙입니다.

일반적인 Next.js/Supabase/React 지식이나 `CLAUDE.md`에 이미 설명된 내용은 반복하지 않습니다.
클라이언트 경계, `proxy.ts` 관례, 인증 흐름은 먼저 `CLAUDE.md`를 참고하세요.

이 파일은 단일 파일만 읽어서는 알 수 없는 아래 두 가지만 다룹니다.

- **프로젝트 고유의 함정**
- **여러 파일을 동시에 고쳐야 하는 지점**

## 프로젝트 개요

- 이 저장소는 Supabase+Next.js 스타터 킷 그대로이며, 그 위에 추가된 기능은 Google OAuth 로그인 하나뿐입니다.
  (`2b432c4 Google 로그인 기능 추가`)

- `docs/PRD.md`, `docs/ROADMAP.md`(Git 미추적, 신규 추가)는 "Gather"라는 **목표 제품**을 설명합니다.
  - 이벤트 초대 플랫폼: `users`/`events`/`event_participants` 테이블, `/admin/*`, `/join/[invite_code]`, 실시간 참여자 목록, Recharts 대시보드
  - **이 중 아무것도 아직 구현되어 있지 않습니다.**
  - 두 문서는 미래 스펙으로만 취급하고, 현재 상태를 설명하는 문서로 여기지 마세요.

- `docs/PRD.md` / `docs/ROADMAP.md`에 언급된 테이블·라우트·페이지는 `app/`, `components/`, `supabase/migrations/`에서 실제로 존재하는지 확인하기 전까지 존재한다고 추정하지 마세요.

## 현재 구현된 범위 (확장 전 반드시 확인)

- **인증 페이지**
  `app/auth/{login,sign-up,sign-up-success,forgot-password,update-password,error}/page.tsx`
  `app/auth/confirm/route.ts`
  `app/auth/callback/route.ts` (OAuth 코드 교환)

- **인증 폼**
  `components/{login-form,sign-up-form,forgot-password-form,update-password-form,google-login-button,logout-button,auth-button}.tsx`

- **데이터**
  `public.profiles` 테이블 단 하나뿐입니다.
  - `supabase/migrations/20261020155024_create_profiles.sql`
  - `supabase/migrations/20261020155051_restrict_handle_new_user_execute.sql`
  - `lib/supabase/database.types.ts`에 그대로 반영됨
  - `users`, `events`, `event_participants` 테이블은 **존재하지 않습니다.** PRD의 데이터 모델은 아직 희망사항입니다.

- **UI 컴포넌트**
  `components/ui/`에는 현재 `badge`, `button`, `card`, `checkbox`, `dropdown-menu`, `input`, `label`만 있습니다.
  - `docs/ROADMAP.md`에 언급된 다른 shadcn 컴포넌트(Avatar, Dialog, Toast, Form, Select)를 쓰려면 반드시 `npx shadcn@latest add <component>`로 추가하세요.
  - `components/ui/`에 직접 손으로 작성해서 대체하지 마세요.

## 기능 구현 표준

- **`profiles`를 확장하고 `users`를 새로 만들지 마세요.**
  - PRD 기능 중 사용자 필드(예: `role`)가 필요한 경우, `alter table public.profiles add column ...` 형태의 마이그레이션을 추가하세요.
  - `id uuid references auth.users(id)`를 그대로 키로 사용하세요.
  - `profiles`가 이미 Supabase 스타터 킷 관례상의 "users 테이블" 역할을 하므로 별도의 `users` 테이블을 만들지 마세요.

- **Google OAuth 중복 규칙.**
  - `components/login-form.tsx`와 `components/sign-up-form.tsx`는 각각 독립적으로 `<GoogleLoginButton />`과 동일한 "또는" 구분선 블록을 렌더링합니다.
  - OAuth 버튼, 라벨, 구분선을 바꾸거나 다른 provider를 추가할 때는 공유 래퍼가 없으므로 **두 파일을 동일하게** 수정하세요.

- **`app/auth/callback/route.ts`가 유일한 OAuth 리다이렉트 대상입니다.**
  - `GoogleLoginButton`은 `redirectTo: ${origin}/auth/callback`을 하드코딩합니다.
  - 다른 OAuth provider를 추가할 때도 이 같은 라우트를 가리키게 하세요. (이미 범용 `exchangeCodeForSession` + `error`/`error_description` 쿼리 파라미터 처리를 지원함)
  - 두 번째 콜백 라우트를 새로 만들지 마세요.

- **스키마 변경은 마이그레이션 + MCP로만, 손으로 하지 마세요.**
  DB를 변경할 때 다음 순서를 따르세요.
  1. `supabase/migrations/`에 새 파일 작성
  2. `mcp__supabase__apply_migration`으로 적용
  3. `mcp__supabase__generate_typescript_types`로 `lib/supabase/database.types.ts` 재생성
  - `database.types.ts`는 절대 손으로 수정하지 마세요.

- **`lib/supabase/proxy.ts`의 허용 목록에는 죽은 튜토리얼 경로가 남아 있습니다.**
  - `!request.nextUrl.pathname.startsWith("/instruments")` 체크는 이 저장소에 존재하지 않는 페이지를 가리키는, 업스트림 스타터 템플릿의 잔재입니다.
  - 새 공개 라우트(예: 향후 `/join/[invite_code]`)를 추가할 때는 이 허용 목록 블록에 명시적으로 추가하세요.
  - `/instruments` 같은 잔재가 뭔가를 커버해줄 거라고 가정하지 마세요.
  - 이 함수를 다른 이유로 건드리게 된다면 죽은 항목을 함께 정리해도 됩니다.

## 핵심 파일 상호작용 표준

| 이것을 변경하면…                                                  | 이것도 함께 확인/수정해야 합니다…                                                                                                                                                                                                |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/google-login-button.tsx` (라벨, 리다이렉트, provider) | `components/login-form.tsx`와 `components/sign-up-form.tsx` (둘 다 동일하게 포함하고 있음)                                                                                                                                       |
| `supabase/migrations/*.sql` (신규 마이그레이션 전부)              | `lib/supabase/database.types.ts` (MCP로 재생성, 절대 손으로 수정 금지)                                                                                                                                                           |
| `lib/supabase/proxy.ts`의 공개/인증 예외 라우트                   | 루트 `proxy.ts`의 `config.matcher`는 건드릴 필요 없음 — proxy가 어떤 요청에 대해 실행될지만 결정하며, 어떤 경로가 인증 리다이렉트를 건너뛸지는 결정하지 않음                                                                     |
| `docs/ROADMAP.md`의 작업 체크박스                                 | 체크박스 상태를 직접 고치지 말고 `docs:update-roadmap` 스킬 사용                                                                                                                                                                 |
| `public.profiles`의 RLS 정책                                      | `20261020155024_create_profiles.sql`의 `handle_new_user()`가 새 정책과 여전히 호환되는지 재확인 (이 함수는 `security definer`로 삽입하여 RLS를 의도적으로 우회함 — 일반 insert 체크를 통과한다고 가정하는 정책을 추가하지 말 것) |

## AI 의사결정 표준

- `docs/PRD.md`나 `docs/ROADMAP.md`에 설명된 내용을 구현하기 전에:
  - 먼저 `app/`, `components/`, `supabase/migrations/`에서 해당 기능을 grep으로 확인하세요.
  - 없다면 새 작업으로 만드세요 — 이미 구현되어 있다고 가정하고 그 주변을 수정하지 마세요.

- ROADMAP 작업과 현재 마이그레이션의 스키마가 어긋나는 경우:
  - 예: ROADMAP Task 007이 `users`/`events`/`event_participants`를 새 테이블로 나열
  - PRD의 테이블 이름 그대로 따르기보다 **기존 `profiles` 관례를 우선**하세요.
  - 두 번째 사용자 테이블을 조용히 만들지 말고 이름 불일치를 명시적으로 짚으세요.

- PRD의 관리자 전용 라우트(`/admin/*`)를 추가해야 한다면:
  - 오늘날 `app/protected/`가 보호되는 방식과 동일하게 처리하세요.
  - `lib/supabase/proxy.ts`의 허용 목록/claims 체크에 리다이렉트 로직을 추가하는 방식을 쓰세요.
  - 별도의 독립 미들웨어 파일을 새로 만들지 마세요.

## 금지 행위

- `public.handle_new_user()`에 대한 `execute` 권한을 `anon`/`authenticated`에 **절대 다시 부여하지 마세요.**
  `20261020155051_restrict_handle_new_user_execute.sql`에서 명시적으로 회수되었으며, 이는 `security definer` 트리거 함수이기 때문입니다.

- `lib/supabase/database.types.ts`를 **절대 손으로 수정하지 마세요.**
  생성된 결과물입니다.

- 루트에 `middleware.ts`를 **절대 새로 만들지 마세요.**
  이 프로젝트는 `proxy.ts`만 사용합니다(`CLAUDE.md` 참고). `middleware.ts`가 생기면 `proxy.ts`와 함께 조용히 공존하거나 이를 가려버려 세션 처리가 중복·충돌할 수 있습니다.

- `npm run check-all` / `typecheck` / `format:check` 등 `docs/guides/*.md`에만 언급된 명령을 실제로 존재하는 것으로 **절대 취급하지 마세요.**
  `package.json`에 정의되어 있지 않습니다. 단독 타입 체크가 필요하면 `npx tsc --noEmit`을 사용하세요.

- `docs/PRD.md`의 `users`/`events`/`event_participants` 테이블, `/admin/*` 페이지, `/join/[invite_code]` 라우트가 존재한다고 **절대 가정하지 마세요.**
  먼저 `app/`과 `supabase/migrations/`에서 확인하세요.
