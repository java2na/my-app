-- Enable Realtime (Postgres Changes) on event_participants so the event detail page
-- can live-update the participant list (PRD F005).
alter publication supabase_realtime add table public.event_participants;
