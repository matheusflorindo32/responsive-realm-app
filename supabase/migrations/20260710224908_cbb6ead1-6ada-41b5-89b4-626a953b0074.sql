
-- 1) Public view for certificates (owner-run, filters valid + safe columns)
CREATE OR REPLACE VIEW public.public_certificates AS
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

-- 2) Drop the SECURITY DEFINER RPCs replaced by the view
DROP FUNCTION IF EXISTS public.verify_certificate(text);
DROP FUNCTION IF EXISTS public.list_public_certificates(integer);

-- 3) admin_metrics -> SECURITY INVOKER (self role-check remains)
ALTER FUNCTION public.admin_metrics() SECURITY INVOKER;
