
-- Recreate view with security_invoker so caller RLS applies
DROP VIEW IF EXISTS public.public_certificates;
CREATE VIEW public.public_certificates
WITH (security_invoker = true) AS
SELECT
  certificate_code,
  student_name,
  course_title,
  trail_name,
  issuer,
  hours,
  issued_at,
  status,
  revoked_at
FROM public.certificates
WHERE status = 'valid';

REVOKE ALL ON public.public_certificates FROM PUBLIC;
GRANT SELECT ON public.public_certificates TO anon, authenticated, service_role;

-- Column-level SELECT on the underlying table (public columns only)
GRANT SELECT (certificate_code, student_name, course_title, trail_name, issuer, hours, issued_at, status, revoked_at)
  ON public.certificates TO anon, authenticated;

-- RLS policy so anon/authenticated can read only valid certificates
DROP POLICY IF EXISTS "Public reads valid certificates" ON public.certificates;
CREATE POLICY "Public reads valid certificates"
  ON public.certificates
  FOR SELECT
  TO anon, authenticated
  USING (status = 'valid');
