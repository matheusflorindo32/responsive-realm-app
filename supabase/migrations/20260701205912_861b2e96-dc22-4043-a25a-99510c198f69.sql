
ALTER FUNCTION public.sheet_rows_before_write() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.handle_first_user_admin() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_first_user_admin() TO service_role;

REVOKE EXECUTE ON FUNCTION public.sheet_rows_before_write() FROM PUBLIC, anon;
