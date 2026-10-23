-- Fixes two issues flagged by the Supabase advisors right after the previous
-- 4 migrations were applied:
--
-- 1) SECURITY (authenticated_security_definer_function_executable): because
--    public.is_event_member() lived in the public schema with EXECUTE granted
--    to `authenticated`, PostgREST auto-exposed it at /rest/v1/rpc/is_event_member.
--    Fix: move the helper into a new `private` schema, which is never in
--    PostgREST's exposed schema list, while still granting `authenticated`
--    USAGE+EXECUTE so RLS policy evaluation keeps working.
--
-- 2) PERFORMANCE (auth_rls_initplan): the new events/event_participants
--    policies called auth.uid() directly, which gets re-evaluated per row.
--    Fix: wrap it as (select auth.uid()) so Postgres caches it as an InitPlan.
--    (The pre-existing profiles policies have the same warning but are out of
--    scope for this migration -- they predate Task 007.)

create schema if not exists private;
grant usage on schema private to authenticated;

create function private.is_event_member(p_event_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.event_participants ep
    where ep.event_id = p_event_id and ep.user_id = (select auth.uid())
  ) or exists (
    select 1 from public.events e
    where e.id = p_event_id and e.created_by = (select auth.uid())
  );
$$;

revoke all on function private.is_event_member(uuid) from public, anon;
grant execute on function private.is_event_member(uuid) to authenticated;

drop policy "Event members can view the participant list" on public.event_participants;
drop function public.is_event_member(uuid);

create policy "Event members can view the participant list"
  on public.event_participants for select
  using (private.is_event_member(event_id));

drop policy "Authenticated users can create their own events" on public.events;
create policy "Authenticated users can create their own events"
  on public.events for insert
  with check ((select auth.uid()) = created_by);

drop policy "Hosts can update their own events" on public.events;
create policy "Hosts can update their own events"
  on public.events for update
  using ((select auth.uid()) = created_by)
  with check ((select auth.uid()) = created_by);

drop policy "Hosts can delete their own events" on public.events;
create policy "Hosts can delete their own events"
  on public.events for delete
  using ((select auth.uid()) = created_by);

drop policy "Users can join events as participants" on public.event_participants;
create policy "Users can join events as participants"
  on public.event_participants for insert
  with check ((select auth.uid()) = user_id and role = 'participant');

drop policy "Users can leave events they joined" on public.event_participants;
create policy "Users can leave events they joined"
  on public.event_participants for delete
  using ((select auth.uid()) = user_id);
