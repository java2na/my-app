-- Backfill profiles for existing auth.users rows that lost their profile row
-- (handle_new_user only fires on INSERT into auth.users, so an existing user
-- never gets a profile row re-created automatically once it's missing).
insert into public.profiles (id, email, full_name, avatar_url)
select
  id,
  email,
  raw_user_meta_data ->> 'full_name',
  raw_user_meta_data ->> 'avatar_url'
from auth.users
on conflict (id) do nothing;
