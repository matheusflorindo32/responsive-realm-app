
-- =============================================================
-- UPGRADE PREMIUM — Área de Ensino
-- Aditivo, não quebra nada existente.
-- =============================================================

-- 1.1 Enriquecer courses ------------------------------------------------
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS trailer_url text,
  ADD COLUMN IF NOT EXISTS requirements text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS target_audience text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS learning_objectives text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS materials jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS instructor_name text;

-- Adicionar 'archived' ao enum content_status se ainda não existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON e.enumtypid=t.oid WHERE t.typname='content_status' AND e.enumlabel='archived') THEN
    ALTER TYPE public.content_status ADD VALUE 'archived';
  END IF;
EXCEPTION WHEN undefined_object THEN
  NULL;
END $$;

-- 1.2 Certificados aprimorados -----------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='certificate_status') THEN
    CREATE TYPE public.certificate_status AS ENUM ('valid','revoked');
  END IF;
END $$;

ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS hours int,
  ADD COLUMN IF NOT EXISTS student_name text,
  ADD COLUMN IF NOT EXISTS course_title text,
  ADD COLUMN IF NOT EXISTS status public.certificate_status NOT NULL DEFAULT 'valid',
  ADD COLUMN IF NOT EXISTS revoked_at timestamptz,
  ADD COLUMN IF NOT EXISTS revoked_reason text;

-- Garantir certificate_code único e default
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='certificates_certificate_code_key'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname='certificates_certificate_code_key'
  ) THEN
    -- garantir todas linhas com código
    UPDATE public.certificates SET certificate_code = encode(gen_random_bytes(9),'hex') WHERE certificate_code IS NULL;
    ALTER TABLE public.certificates ALTER COLUMN certificate_code SET NOT NULL;
    ALTER TABLE public.certificates ALTER COLUMN certificate_code SET DEFAULT encode(gen_random_bytes(9),'hex');
    CREATE UNIQUE INDEX certificates_certificate_code_key ON public.certificates(certificate_code);
  END IF;
END $$;

-- Snapshot automático ao emitir (student_name, course_title, hours)
CREATE OR REPLACE FUNCTION public.snapshot_certificate_data()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_name text; v_title text; v_hours int;
BEGIN
  IF NEW.student_name IS NULL THEN
    SELECT display_name INTO v_name FROM public.profiles WHERE user_id = NEW.user_id;
    NEW.student_name := COALESCE(v_name,'Aluno');
  END IF;
  IF NEW.course_id IS NOT NULL AND (NEW.course_title IS NULL OR NEW.hours IS NULL) THEN
    SELECT title, COALESCE(duration_min/60, NULL) INTO v_title, v_hours FROM public.courses WHERE id = NEW.course_id;
    NEW.course_title := COALESCE(NEW.course_title, v_title);
    NEW.hours := COALESCE(NEW.hours, v_hours);
  END IF;
  IF NEW.trail_id IS NOT NULL AND NEW.course_title IS NULL THEN
    SELECT name INTO v_title FROM public.trails WHERE id = NEW.trail_id;
    NEW.course_title := COALESCE(NEW.course_title, v_title);
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_certificates_snapshot ON public.certificates;
CREATE TRIGGER trg_certificates_snapshot
  BEFORE INSERT ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.snapshot_certificate_data();

-- Função pública para validar certificado por código (sem expor tabela)
CREATE OR REPLACE FUNCTION public.verify_certificate(_code text)
RETURNS TABLE (
  certificate_code text,
  student_name text,
  course_title text,
  hours int,
  issued_at timestamptz,
  status public.certificate_status,
  revoked_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT certificate_code, student_name, course_title, hours, issued_at, status, revoked_at
  FROM public.certificates
  WHERE certificate_code = _code
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.verify_certificate(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO anon, authenticated;

-- 1.3 Auditoria administrativa -----------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  target_user_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_audit_log_created_idx ON public.admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS admin_audit_log_target_idx ON public.admin_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS admin_audit_log_entity_idx ON public.admin_audit_log(entity_type, entity_id);

GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read audit" ON public.admin_audit_log;
CREATE POLICY "Admins read audit" ON public.admin_audit_log
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'));
-- Sem INSERT/UPDATE/DELETE do client — só triggers e service_role.

-- Trigger genérico de auditoria
CREATE OR REPLACE FUNCTION public.tg_audit_row()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_action text;
  v_entity text := TG_TABLE_NAME;
  v_entity_id uuid;
  v_target uuid;
  v_meta jsonb := '{}'::jsonb;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := v_entity || '.created';
    v_entity_id := NEW.id;
    v_target := CASE WHEN v_entity = 'enrollments' THEN NEW.user_id ELSE NULL END;
    v_meta := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    v_entity_id := NEW.id;
    v_target := CASE WHEN v_entity = 'enrollments' THEN NEW.user_id ELSE NULL END;
    IF v_entity = 'enrollments' AND NEW.status IS DISTINCT FROM OLD.status THEN
      v_action := 'enrollments.status_changed';
      v_meta := jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status);
    ELSIF v_entity = 'enrollments' AND NEW.expires_at IS DISTINCT FROM OLD.expires_at THEN
      v_action := 'enrollments.expiration_changed';
      v_meta := jsonb_build_object('old_expires_at', OLD.expires_at, 'new_expires_at', NEW.expires_at);
    ELSE
      v_action := v_entity || '.updated';
      v_meta := jsonb_build_object('changed_at', now());
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    v_action := v_entity || '.deleted';
    v_entity_id := OLD.id;
    v_target := CASE WHEN v_entity = 'enrollments' THEN OLD.user_id ELSE NULL END;
    v_meta := to_jsonb(OLD);
  END IF;

  -- Só registra se houver ator autenticado (evita ruído de jobs internos)
  IF v_actor IS NOT NULL THEN
    INSERT INTO public.admin_audit_log(actor_id, action, entity_type, entity_id, target_user_id, metadata)
    VALUES (v_actor, v_action, v_entity, v_entity_id, v_target, v_meta);
  END IF;

  RETURN COALESCE(NEW, OLD);
END $$;

DROP TRIGGER IF EXISTS trg_audit_enrollments ON public.enrollments;
CREATE TRIGGER trg_audit_enrollments
  AFTER INSERT OR UPDATE OR DELETE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();

DROP TRIGGER IF EXISTS trg_audit_courses ON public.courses;
CREATE TRIGGER trg_audit_courses
  AFTER INSERT OR UPDATE OR DELETE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();

DROP TRIGGER IF EXISTS trg_audit_trails ON public.trails;
CREATE TRIGGER trg_audit_trails
  AFTER INSERT OR UPDATE OR DELETE ON public.trails
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();

DROP TRIGGER IF EXISTS trg_audit_lessons ON public.lessons;
CREATE TRIGGER trg_audit_lessons
  AFTER INSERT OR UPDATE OR DELETE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.tg_audit_row();

-- 1.4 Pagamentos idempotentes ------------------------------------------
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS provider_payment_id text,
  ADD COLUMN IF NOT EXISTS provider_event_id text,
  ADD COLUMN IF NOT EXISTS raw_payload jsonb,
  ADD COLUMN IF NOT EXISTS processed_at timestamptz,
  ADD COLUMN IF NOT EXISTS course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS trail_id uuid REFERENCES public.trails(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS payments_provider_event_uk
  ON public.payments(provider, provider_event_id)
  WHERE provider_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS payments_provider_payment_idx
  ON public.payments(provider, provider_payment_id);

-- Função idempotente para o webhook futuro
CREATE OR REPLACE FUNCTION public.grant_enrollment_from_payment(_payment_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_pay public.payments%ROWTYPE;
  v_scope public.enrollment_scope;
  v_existing uuid;
  v_new_id uuid;
BEGIN
  SELECT * INTO v_pay FROM public.payments WHERE id = _payment_id FOR UPDATE;
  IF NOT FOUND OR v_pay.status <> 'paid' THEN RETURN NULL; END IF;
  IF v_pay.processed_at IS NOT NULL THEN
    -- já processado — devolve enrollment existente se houver
    SELECT id INTO v_existing FROM public.enrollments WHERE payment_id = v_pay.id LIMIT 1;
    RETURN v_existing;
  END IF;

  IF v_pay.course_id IS NOT NULL THEN
    v_scope := 'course';
  ELSIF v_pay.trail_id IS NOT NULL THEN
    v_scope := 'trail';
  ELSE
    RETURN NULL;
  END IF;

  -- Já existe enrollment ativo pra esse alvo?
  SELECT id INTO v_existing FROM public.enrollments
   WHERE user_id = v_pay.user_id
     AND status = 'active'
     AND ((v_scope='course' AND course_id = v_pay.course_id) OR (v_scope='trail' AND trail_id = v_pay.trail_id))
   LIMIT 1;

  IF v_existing IS NOT NULL THEN
    UPDATE public.payments SET processed_at = now() WHERE id = v_pay.id;
    RETURN v_existing;
  END IF;

  INSERT INTO public.enrollments(user_id, scope, course_id, trail_id, status, access_type, source, payment_id)
  VALUES (
    v_pay.user_id, v_scope,
    CASE WHEN v_scope='course' THEN v_pay.course_id END,
    CASE WHEN v_scope='trail'  THEN v_pay.trail_id  END,
    'active','purchase',
    v_pay.provider::text || ':' || COALESCE(v_pay.provider_payment_id,''),
    v_pay.id
  )
  RETURNING id INTO v_new_id;

  UPDATE public.payments SET processed_at = now() WHERE id = v_pay.id;
  RETURN v_new_id;
END $$;

REVOKE ALL ON FUNCTION public.grant_enrollment_from_payment(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.grant_enrollment_from_payment(uuid) TO service_role;

-- 1.5 Reforçar RLS de conteúdo/progresso -------------------------------

-- lesson_progress: instrutor da trilha lê progresso dos alunos
DROP POLICY IF EXISTS "Instructor reads trail progress" ON public.lesson_progress;
CREATE POLICY "Instructor reads trail progress" ON public.lesson_progress
  FOR SELECT TO authenticated USING (
    private.has_role(auth.uid(),'admin')
    OR EXISTS (
      SELECT 1 FROM public.lessons l
      JOIN public.modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      WHERE l.id = lesson_progress.lesson_id
        AND private.has_trail_role(auth.uid(), c.trail_id, 'instructor')
    )
  );

-- enrollments: instrutor lê matriculas da sua trilha
DROP POLICY IF EXISTS "Instructor reads trail enrollments" ON public.enrollments;
CREATE POLICY "Instructor reads trail enrollments" ON public.enrollments
  FOR SELECT TO authenticated USING (
    private.has_role(auth.uid(),'admin')
    OR (trail_id IS NOT NULL AND private.has_trail_role(auth.uid(), trail_id, 'instructor'))
    OR (course_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.courses c WHERE c.id = enrollments.course_id
        AND private.has_trail_role(auth.uid(), c.trail_id, 'instructor')
    ))
  );

-- Reafirmar REVOKE em funções privadas
REVOKE ALL ON FUNCTION private.has_trail_role(uuid, uuid, public.trail_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_trail_role(uuid, uuid, public.trail_role) TO authenticated, service_role;
