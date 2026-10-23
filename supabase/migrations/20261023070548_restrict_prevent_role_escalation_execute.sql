-- prevent_profiles_role_self_escalation() is a SECURITY DEFINER trigger
-- function and should not be callable directly via the PostgREST RPC
-- endpoint by anon/authenticated roles (same pattern as
-- 20261020155051_restrict_handle_new_user_execute.sql).
revoke execute on function public.prevent_profiles_role_self_escalation() from public, anon, authenticated;
