-- Prevent authenticated users from escalating their own privileges by directly
-- updating profiles.role through the existing "Users can update their own
-- profile" RLS policy (which only checks auth.uid() = id, with no column
-- restriction). A BEFORE UPDATE trigger forces role back to its previous
-- value for any request that isn't made with the service_role key, so the
-- admin backend (Task 011) can still change roles via service_role while
-- regular users cannot change their own.
create function public.prevent_profiles_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.jwt() ->> 'role') = 'service_role' then
    return new;
  end if;

  if new.role is distinct from old.role then
    new.role := old.role;
  end if;

  return new;
end;
$$;

create trigger before_profiles_role_update
  before update on public.profiles
  for each row execute function public.prevent_profiles_role_self_escalation();

comment on function public.prevent_profiles_role_self_escalation() is
  'Blocks self-service role changes on profiles; only service_role requests (admin backend) may change role.';
