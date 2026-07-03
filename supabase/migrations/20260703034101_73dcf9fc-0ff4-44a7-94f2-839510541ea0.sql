
-- Trigger-only functions: revogar EXECUTE de todos os papéis públicos
REVOKE ALL ON FUNCTION public.tg_audit_row() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.snapshot_certificate_data() FROM PUBLIC, anon, authenticated;
-- (rodam apenas como triggers, não precisam de EXECUTE público)
