
REVOKE ALL ON FUNCTION public.admin_metrics() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_metrics() TO authenticated, service_role;
