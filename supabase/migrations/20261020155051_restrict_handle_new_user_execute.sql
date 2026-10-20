-- handle_new_user() is a SECURITY DEFINER trigger function and should not be
-- callable directly via the PostgREST RPC endpoint by anon/authenticated roles.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
