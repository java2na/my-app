# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Next.js + Supabase starter kit (App Router). Cookie-based Supabase Auth via `@supabase/ssr`, shadcn/ui (new-york style) components, Tailwind CSS.

## Commands

```bash
npm run dev     # start dev server (localhost:3000)
npm run build   # production build
npm run start   # run production build
npm run lint    # eslint (next/core-web-vitals + next/typescript)
```

There is no test suite and no `typecheck`/`format` script configured — use `npx tsc --noEmit` directly if you need a standalone type check. Treat any `docs/guides/*.md` reference to commands like `npm run check-all`, `typecheck`, or `format:check` as aspirational, not real — they are not defined in `package.json`.

To add shadcn/ui components: `npx shadcn@latest add <component>` (writes into `components/ui/`, per `components.json`).

## Architecture

### Supabase client boundaries

There are three distinct Supabase client constructors in `lib/supabase/`, each for a different execution context — do not mix them up:

- `lib/supabase/client.ts` — `createBrowserClient`, for Client Components.
- `lib/supabase/server.ts` — `createServerClient` backed by `next/headers` cookies, for Server Components/Actions/Route Handlers. Must be instantiated fresh per request/function call (never hoisted to a module-level singleton — the comment in the file calls this out explicitly re: Fluid compute).
- `lib/supabase/proxy.ts` — `updateSession()`, used only from the root `proxy.ts`.

All three are typed with the generated `Database` type from `lib/supabase/database.types.ts`.

Auth reads should prefer `supabase.auth.getClaims()` over `getUser()` (faster, used consistently across `components/auth-button.tsx`, `app/protected/page.tsx`, `lib/supabase/proxy.ts`).

### Root-level `proxy.ts` (not `middleware.ts`)

This project uses the newer Next.js `proxy.ts` convention (root of repo, sibling to `app/`) instead of `middleware.ts`. It delegates to `updateSession()` in `lib/supabase/proxy.ts`, which refreshes the Supabase session and redirects unauthenticated requests to `/auth/login`. When editing session/redirect logic, the redirect allowlist (public paths) lives inline in `lib/supabase/proxy.ts`, not in the matcher — the `config.matcher` in `proxy.ts` only controls which requests the proxy runs on at all (static assets/images are excluded).

`next.config.ts` sets `cacheComponents: true` — this is a bleeding-edge/experimental Next.js flag; keep that in mind when hitting caching-related oddities in Server Components.

### Auth flow

Auth pages live under `app/auth/*` (login, sign-up, forgot-password, update-password, confirm, error) and submit via Server Actions-style client components (`components/*-form.tsx`) that call Supabase directly, not via a separate `app/actions/` layer. `app/auth/confirm/route.ts` is the email OTP verification Route Handler Supabase redirects to.

`app/protected/` is the authenticated area; its `layout.tsx` renders the nav/footer shell, and access control is enforced by the proxy redirect rather than per-page checks (though `app/protected/page.tsx` also redirects defensively if claims are missing).

`lib/utils.ts` exports `hasEnvVars`, a guard used in layouts/components to show `components/env-var-warning.tsx` instead of auth UI when Supabase env vars aren't configured yet — this is a tutorial affordance, not a feature to build on.

### Database / Supabase project

Migrations live in `supabase/migrations/`. The current schema creates a `public.profiles` table (RLS-enabled, one row per `auth.users` row) with triggers to auto-create a profile row on sign-up (`handle_new_user`, `security definer`) and keep `updated_at` current. `handle_new_user`'s PostgREST RPC execute permission is explicitly revoked from `anon`/`authenticated` in a follow-up migration — don't re-grant it.

The Supabase MCP server is configured in `.mcp.json` against project ref `sgxhqjgrhbxykuftohxr`; use it (or the Supabase CLI) rather than hand-editing `lib/supabase/database.types.ts`, which is generated.

### Path aliases

`@/*` maps to the repo root (see `tsconfig.json`). Despite `docs/guides/project-structure.md` describing a `src/` layout, this repo has no `src/` directory — `app/`, `components/`, and `lib/` are all at the repo root. Follow the actual layout, not that doc.

### Styling

Semantic Tailwind color tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, etc.) are defined as CSS variables in `app/globals.css` and support dark mode via `next-themes` (see `components/theme-switcher.tsx`). Use `cn()` from `lib/utils.ts` to compose conditional classes; avoid hardcoded colors or inline styles.

## Notes on `docs/guides/`

The guides in `docs/guides/` (`nextjs-15.md`, `component-patterns.md`, `forms-react-hook-form.md`, `project-structure.md`, `styling-guide.md`) are generic reference material for Next.js/React/Tailwind patterns, largely written in Korean, and are not fully in sync with this repo's actual structure or dependencies (e.g. they assume `src/`, React Hook Form + Zod, and npm scripts that aren't installed/configured here). Treat them as general pattern references, not as a description of this codebase's current state.
