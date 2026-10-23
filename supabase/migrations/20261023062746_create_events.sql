-- Create the events table (Gather one-off event records).
-- Status (upcoming/ongoing/ended) is intentionally NOT stored here -- it is derived
-- from event_date vs now() at query/view-model time, since a single timestamp cannot
-- reliably represent an "ongoing" window without a scheduler (pg_cron is not installed).
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 50),
  description text check (description is null or char_length(description) <= 500),
  location text not null check (char_length(location) between 1 and 100),
  event_date timestamptz not null,
  cover_image_url text,
  invite_code text not null unique check (char_length(invite_code) >= 6),
  created_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.events is 'Gather 이벤트(일회성 모임) 정보. status는 저장하지 않고 event_date로부터 파생한다.';

alter table public.events enable row level security;

-- Reuse the updated_at trigger function already defined for profiles.
create trigger on_events_updated
  before update on public.events
  for each row execute function public.handle_updated_at();

create index idx_events_created_by on public.events (created_by);

-- Events are readable by everyone (including anonymous visitors), mirroring the
-- "Profiles are viewable by everyone" policy -- the /join/[invite_code] preview page
-- must work for logged-out users.
create policy "Events are viewable by everyone"
  on public.events for select
  using (true);

create policy "Authenticated users can create their own events"
  on public.events for insert
  with check (auth.uid() = created_by);

create policy "Hosts can update their own events"
  on public.events for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "Hosts can delete their own events"
  on public.events for delete
  using (auth.uid() = created_by);
