-- Realtime postgres_changes needs the full old row on DELETE/UPDATE to evaluate
-- the "Event members can view the participant list" RLS policy (which reads
-- event_id from the old row). Default replica identity only exposes the
-- primary key on old rows, so DELETE events were silently dropped for
-- subscribers (Task 010 live participant list).
alter table public.event_participants replica identity full;
