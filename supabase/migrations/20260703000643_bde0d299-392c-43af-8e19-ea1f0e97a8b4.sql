
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_first_user_admin() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sheet_rows_before_write() FROM PUBLIC, anon, authenticated;
