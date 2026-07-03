CREATE OR REPLACE FUNCTION public.list_public_certificates(_limit int DEFAULT 12)
RETURNS TABLE (
  certificate_code text,
  student_name text,
  course_title text,
  trail_name text,
  issuer text,
  hours integer,
  issued_at timestamptz
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT certificate_code, student_name, course_title, trail_name, issuer, hours, issued_at
  FROM public.certificates
  WHERE status = 'valid'
  ORDER BY issued_at DESC
  LIMIT LEAST(GREATEST(_limit, 1), 48);
$$;

REVOKE ALL ON FUNCTION public.list_public_certificates(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_public_certificates(int) TO anon, authenticated;