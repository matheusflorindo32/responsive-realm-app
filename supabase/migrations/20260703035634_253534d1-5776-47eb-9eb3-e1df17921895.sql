
-- =============================================================
-- REFORÇOS INCREMENTAIS
-- =============================================================

-- 1. Trigger enforcement: só salva progresso se aluno tem acesso ativo
CREATE OR REPLACE FUNCTION public.tg_check_lesson_access()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, private AS $$
DECLARE v_course_id uuid;
BEGIN
  IF NEW.user_id IS DISTINCT FROM auth.uid() AND NOT private.has_role(auth.uid(),'admin') THEN
    RAISE EXCEPTION 'Não pode marcar progresso em nome de outro usuário';
  END IF;
  SELECT m.course_id INTO v_course_id FROM public.lessons l JOIN public.modules m ON m.id=l.module_id WHERE l.id = NEW.lesson_id;
  IF v_course_id IS NULL THEN RETURN NEW; END IF;
  IF private.has_role(NEW.user_id,'admin') THEN RETURN NEW; END IF;
  IF NOT private.has_course_access(NEW.user_id, v_course_id) THEN
    RAISE EXCEPTION 'Sem matrícula ativa para este curso';
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.tg_check_lesson_access() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_check_lesson_access ON public.lesson_progress;
CREATE TRIGGER trg_check_lesson_access
  BEFORE INSERT OR UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.tg_check_lesson_access();

-- 2. Anotações por aula
CREATE TABLE IF NOT EXISTS public.lesson_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS lesson_notes_user_idx ON public.lesson_notes(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_notes TO authenticated;
GRANT ALL ON public.lesson_notes TO service_role;
ALTER TABLE public.lesson_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner all own notes" ON public.lesson_notes;
CREATE POLICY "Owner all own notes" ON public.lesson_notes
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admin reads notes" ON public.lesson_notes;
CREATE POLICY "Admin reads notes" ON public.lesson_notes
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'));

-- 3. Certificados: issuer + trail_name snapshot
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS issuer text DEFAULT 'Tropa Científica',
  ADD COLUMN IF NOT EXISTS trail_name text;

-- Atualiza função de snapshot pra incluir trail_name
CREATE OR REPLACE FUNCTION public.snapshot_certificate_data()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_name text; v_title text; v_hours int; v_trail text;
BEGIN
  IF NEW.student_name IS NULL THEN
    SELECT display_name INTO v_name FROM public.profiles WHERE user_id = NEW.user_id;
    NEW.student_name := COALESCE(v_name,'Aluno');
  END IF;
  IF NEW.course_id IS NOT NULL AND (NEW.course_title IS NULL OR NEW.hours IS NULL OR NEW.trail_name IS NULL) THEN
    SELECT c.title, COALESCE(c.duration_min/60, NULL), t.name
      INTO v_title, v_hours, v_trail
      FROM public.courses c LEFT JOIN public.trails t ON t.id=c.trail_id
      WHERE c.id = NEW.course_id;
    NEW.course_title := COALESCE(NEW.course_title, v_title);
    NEW.hours := COALESCE(NEW.hours, v_hours);
    NEW.trail_name := COALESCE(NEW.trail_name, v_trail);
  END IF;
  IF NEW.trail_id IS NOT NULL AND NEW.course_title IS NULL THEN
    SELECT name INTO v_title FROM public.trails WHERE id = NEW.trail_id;
    NEW.course_title := COALESCE(NEW.course_title, v_title);
  END IF;
  NEW.issuer := COALESCE(NEW.issuer, 'Tropa Científica');
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.snapshot_certificate_data() FROM PUBLIC, anon, authenticated;

-- verify_certificate estendida (drop e recria por causa da nova coluna)
DROP FUNCTION IF EXISTS public.verify_certificate(text);
CREATE OR REPLACE FUNCTION public.verify_certificate(_code text)
RETURNS TABLE (
  certificate_code text, student_name text, course_title text,
  trail_name text, issuer text, hours int, issued_at timestamptz,
  status public.certificate_status, revoked_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT certificate_code, student_name, course_title, trail_name, issuer,
         hours, issued_at, status, revoked_at
  FROM public.certificates WHERE certificate_code = _code LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.verify_certificate(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO anon, authenticated;

-- 4. Auditoria de certificados (emissão + revogação)
DROP TRIGGER IF EXISTS trg_audit_certificates ON public.certificates;
CREATE TRIGGER trg_audit_certificates
  AFTER INSERT OR UPDATE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();

-- 5. Enriquecer admin_audit_log
ALTER TABLE public.admin_audit_log
  ADD COLUMN IF NOT EXISTS old_data jsonb,
  ADD COLUMN IF NOT EXISTS new_data jsonb,
  ADD COLUMN IF NOT EXISTS ip_address inet,
  ADD COLUMN IF NOT EXISTS user_agent text;

CREATE OR REPLACE FUNCTION public.tg_audit_row()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_action text;
  v_entity text := TG_TABLE_NAME;
  v_entity_id uuid;
  v_target uuid;
  v_meta jsonb := '{}'::jsonb;
  v_old jsonb; v_new jsonb;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := v_entity || '.created';
    v_entity_id := NEW.id;
    v_target := CASE WHEN v_entity IN ('enrollments','certificates') THEN NEW.user_id ELSE NULL END;
    v_new := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    v_entity_id := NEW.id;
    v_target := CASE WHEN v_entity IN ('enrollments','certificates') THEN NEW.user_id ELSE NULL END;
    IF v_entity = 'enrollments' AND NEW.status IS DISTINCT FROM OLD.status THEN
      v_action := 'enrollments.status_changed';
      v_meta := jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status);
    ELSIF v_entity = 'enrollments' AND NEW.expires_at IS DISTINCT FROM OLD.expires_at THEN
      v_action := 'enrollments.expiration_changed';
      v_meta := jsonb_build_object('old_expires_at', OLD.expires_at, 'new_expires_at', NEW.expires_at);
    ELSIF v_entity = 'certificates' AND NEW.status IS DISTINCT FROM OLD.status THEN
      v_action := 'certificates.' || NEW.status::text;
    ELSE
      v_action := v_entity || '.updated';
    END IF;
    v_old := to_jsonb(OLD); v_new := to_jsonb(NEW);
  ELSIF TG_OP = 'DELETE' THEN
    v_action := v_entity || '.deleted';
    v_entity_id := OLD.id;
    v_target := CASE WHEN v_entity IN ('enrollments','certificates') THEN OLD.user_id ELSE NULL END;
    v_old := to_jsonb(OLD);
  END IF;

  IF v_actor IS NOT NULL THEN
    INSERT INTO public.admin_audit_log(actor_id, action, entity_type, entity_id, target_user_id, metadata, old_data, new_data)
    VALUES (v_actor, v_action, v_entity, v_entity_id, v_target, v_meta, v_old, v_new);
  END IF;
  RETURN COALESCE(NEW, OLD);
END $$;
REVOKE ALL ON FUNCTION public.tg_audit_row() FROM PUBLIC, anon, authenticated;

-- 6. Pagamentos: enums estendidos e revogação por estorno
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON e.enumtypid=t.oid WHERE t.typname='payment_status' AND e.enumlabel='chargeback') THEN
    ALTER TYPE public.payment_status ADD VALUE 'chargeback';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON e.enumtypid=t.oid WHERE t.typname='payment_status' AND e.enumlabel='cancelled') THEN
    ALTER TYPE public.payment_status ADD VALUE 'cancelled';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON e.enumtypid=t.oid WHERE t.typname='access_type' AND e.enumlabel='subscription') THEN
    ALTER TYPE public.access_type ADD VALUE 'subscription';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON e.enumtypid=t.oid WHERE t.typname='access_type' AND e.enumlabel='partnership') THEN
    ALTER TYPE public.access_type ADD VALUE 'partnership';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.revoke_enrollment_from_payment(_payment_id uuid)
RETURNS int LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_count int;
BEGIN
  UPDATE public.enrollments SET status='revoked', updated_at=now()
   WHERE payment_id = _payment_id AND status='active';
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END $$;
REVOKE ALL ON FUNCTION public.revoke_enrollment_from_payment(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_enrollment_from_payment(uuid) TO service_role;

-- 7. Métricas do admin
CREATE OR REPLACE FUNCTION public.admin_metrics()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public, private AS $$
DECLARE r jsonb;
BEGIN
  IF NOT private.has_role(auth.uid(),'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  SELECT jsonb_build_object(
    'students_total', (SELECT COUNT(DISTINCT user_id) FROM public.profiles),
    'enrollments_active', (SELECT COUNT(*) FROM public.enrollments WHERE status='active' AND (expires_at IS NULL OR expires_at > now())),
    'enrollments_expiring', (SELECT COUNT(*) FROM public.enrollments WHERE status='active' AND expires_at IS NOT NULL AND expires_at > now() AND expires_at < now()+interval '15 days'),
    'enrollments_expired', (SELECT COUNT(*) FROM public.enrollments WHERE status='active' AND expires_at IS NOT NULL AND expires_at <= now()) + (SELECT COUNT(*) FROM public.enrollments WHERE status='expired'),
    'courses_published', (SELECT COUNT(*) FROM public.courses WHERE status='published'),
    'courses_draft', (SELECT COUNT(*) FROM public.courses WHERE status='draft'),
    'trails_published', (SELECT COUNT(*) FROM public.trails WHERE status='published'),
    'certificates_total', (SELECT COUNT(*) FROM public.certificates),
    'certificates_30d', (SELECT COUNT(*) FROM public.certificates WHERE issued_at > now()-interval '30 days'),
    'students_advanced', (SELECT COUNT(DISTINCT user_id) FROM public.course_progress WHERE pct_complete >= 50),
    'students_inactive_30d', (
      SELECT COUNT(*) FROM public.profiles p
      WHERE NOT EXISTS (SELECT 1 FROM public.lesson_progress lp WHERE lp.user_id=p.user_id AND lp.updated_at > now()-interval '30 days')
    )
  ) INTO r;
  RETURN r;
END $$;
REVOKE ALL ON FUNCTION public.admin_metrics() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_metrics() TO authenticated;
