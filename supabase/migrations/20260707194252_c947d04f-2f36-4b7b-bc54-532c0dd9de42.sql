
-- Revoke EXECUTE from anon/authenticated on SECURITY DEFINER functions that
-- should not be directly callable via the public API. Keep only the ones
-- explicitly intended as public RPCs (verify_certificate, list_public_certificates)
-- and admin_metrics (which self-checks admin role).

-- Trigger functions - only need to run in trigger context (owner)
REVOKE ALL ON FUNCTION public.handle_first_user_admin() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.snapshot_certificate_data() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user_profile() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.tg_check_lesson_access() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.tg_audit_row() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.recalc_course_progress() FROM PUBLIC, anon, authenticated;

-- Definer functions used only by edge functions (service_role) - not exposed via PostgREST
REVOKE ALL ON FUNCTION public.revoke_enrollment_from_payment(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.grant_enrollment_from_payment(uuid) FROM PUBLIC, anon, authenticated;

-- Ensure service_role can still execute (needed for triggers/edge functions)
GRANT EXECUTE ON FUNCTION public.handle_first_user_admin() TO service_role;
GRANT EXECUTE ON FUNCTION public.snapshot_certificate_data() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user_profile() TO service_role;
GRANT EXECUTE ON FUNCTION public.tg_check_lesson_access() TO service_role;
GRANT EXECUTE ON FUNCTION public.tg_audit_row() TO service_role;
GRANT EXECUTE ON FUNCTION public.recalc_course_progress() TO service_role;
GRANT EXECUTE ON FUNCTION public.revoke_enrollment_from_payment(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.grant_enrollment_from_payment(uuid) TO service_role;
