-- handle_new_user() only fires on INSERT into auth.users. When a user who
-- originally signed up with email/password later signs in with Google (OAuth
-- identity linking updates the same auth.users row instead of inserting a
-- new one), raw_user_meta_data gains full_name/avatar_url from Google but
-- profiles never gets backfilled, leaving full_name/avatar_url null forever.
-- Fill-if-null only, so this never overwrites a name/avatar a user has
-- intentionally set (profile name editing doesn't persist yet, but this
-- stays safe once it does).
create function public.sync_profile_from_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set
    full_name = coalesce(full_name, new.raw_user_meta_data ->> 'full_name'),
    avatar_url = coalesce(avatar_url, new.raw_user_meta_data ->> 'avatar_url')
  where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_metadata_updated
  after update of raw_user_meta_data on auth.users
  for each row
  when (new.raw_user_meta_data is distinct from old.raw_user_meta_data)
  execute function public.sync_profile_from_auth_user();

comment on function public.sync_profile_from_auth_user() is
  'Backfills profiles.full_name/avatar_url from auth.users.raw_user_meta_data when it changes (e.g. linking a Google identity), filling only currently-null fields.';

-- Same SECURITY DEFINER trigger function pattern as handle_new_user; must not
-- be callable directly via the PostgREST RPC endpoint.
revoke execute on function public.sync_profile_from_auth_user() from public, anon, authenticated;
