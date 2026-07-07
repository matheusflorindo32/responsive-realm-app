
-- 1. Tighten sheet_rows read policy to admins/editors only
DROP POLICY IF EXISTS "Authenticated read sheet rows" ON public.sheet_rows;
CREATE POLICY "Admins and editors read sheet rows"
  ON public.sheet_rows FOR SELECT
  TO authenticated
  USING (
    private.has_role(auth.uid(), 'admin'::app_role)
    OR private.has_role(auth.uid(), 'editor'::app_role)
  );

-- 2. Revoke EXECUTE from anon/authenticated on all SECURITY DEFINER functions,
--    then re-grant only where intentional.

-- Trigger functions and backend-only helpers: revoke from public roles
REVOKE EXECUTE ON FUNCTION public.handle_first_user_admin()          FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile()          FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.snapshot_certificate_data()        FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalc_course_progress()           FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_audit_row()                     FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_check_lesson_access()           FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_enrollment_from_payment(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.revoke_enrollment_from_payment(uuid) FROM PUBLIC, anon, authenticated;

-- Admin-only RPC (checks admin internally): only authenticated
REVOKE EXECUTE ON FUNCTION public.admin_metrics() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.admin_metrics() TO authenticated;

-- Public certificate lookups: intentionally callable by anon and authenticated
REVOKE EXECUTE ON FUNCTION public.verify_certificate(text)   FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.verify_certificate(text)   TO anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.list_public_certificates(integer) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.list_public_certificates(integer) TO anon, authenticated;
