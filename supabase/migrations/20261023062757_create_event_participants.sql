-- Create event_participants (membership of a profile in an event, host or participant).
create table public.event_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'participant' check (role in ('host', 'participant')),
  joined_at timestamptz not null default now(),
  constraint event_participants_unique unique (event_id, user_id)
);

comment on table public.event_participants is '이벤트별 참여자(호스트 포함) 매핑.';

alter table public.event_participants enable row level security;

create index idx_event_participants_event_id on public.event_participants (event_id);
create index idx_event_participants_user_id on public.event_participants (user_id);

-- Auto-insert the host as a participant row whenever an event is created,
-- mirroring the handle_new_user() auto-profile-creation pattern.
create function public.handle_new_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.event_participants (event_id, user_id, role)
  values (new.id, new.created_by, 'host')
  on conflict (event_id, user_id) do nothing;
  return new;
end;
$$;

create trigger on_event_created
  after insert on public.events
  for each row execute function public.handle_new_event();

-- SECURITY DEFINER trigger function: never callable directly via PostgREST RPC,
-- same rationale as handle_new_user().
revoke execute on function public.handle_new_event() from public, anon, authenticated;

-- Membership-check helper used by RLS policies below, to avoid recursive RLS
-- evaluation when a policy on event_participants needs to query event_participants itself.
create function public.is_event_member(p_event_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.event_participants ep
    where ep.event_id = p_event_id and ep.user_id = auth.uid()
  ) or exists (
    select 1 from public.events e
    where e.id = p_event_id and e.created_by = auth.uid()
  );
$$;

revoke execute on function public.is_event_member(uuid) from public, anon;
grant execute on function public.is_event_member(uuid) to authenticated;

create policy "Event members can view the participant list"
  on public.event_participants for select
  using (public.is_event_member(event_id));

create policy "Users can join events as participants"
  on public.event_participants for insert
  with check (auth.uid() = user_id and role = 'participant');

create policy "Users can leave events they joined"
  on public.event_participants for delete
  using (auth.uid() = user_id);
