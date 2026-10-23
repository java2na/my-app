-- Add a role column to profiles to support admin-gated routes (PRD F010/F012-F015).
-- profiles already acts as the "users table" per shrimp-rules.md; no new users table is created.
alter table public.profiles
  add column role text not null default 'user',
  add constraint profiles_role_check check (role in ('user', 'admin'));

comment on column public.profiles.role is 'Application role: user (default) or admin. Used to gate /admin/* routes.';
