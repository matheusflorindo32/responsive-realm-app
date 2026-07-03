
-- Fix security warnings: revoke execute on new SECURITY DEFINER from public roles
REVOKE EXECUTE ON FUNCTION private.has_trail_role(uuid, uuid, public.trail_role) FROM PUBLIC, anon, authenticated;

-- ENUMS
CREATE TYPE public.enrollment_scope AS ENUM ('course','trail');
CREATE TYPE public.enrollment_status AS ENUM ('pending','active','expired','revoked','refunded');
CREATE TYPE public.access_type AS ENUM ('manual','purchase','gift','trial','scholarship');
CREATE TYPE public.lesson_status AS ENUM ('not_started','in_progress','completed');
CREATE TYPE public.payment_provider AS ENUM ('manual','stripe','mercadopago');
CREATE TYPE public.payment_status AS ENUM ('pending','paid','failed','refunded');

-- PAYMENTS (created first so enrollments can FK it)
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  provider public.payment_provider NOT NULL DEFAULT 'manual',
  provider_ref text,
  amount_cents int NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'BRL',
  status public.payment_status NOT NULL DEFAULT 'pending',
  raw jsonb,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.payments(user_id);
CREATE INDEX ON public.payments(provider, provider_ref);
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner reads own payments" ON public.payments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

-- ENROLLMENTS
CREATE TABLE public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  scope public.enrollment_scope NOT NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  trail_id uuid REFERENCES public.trails(id) ON DELETE CASCADE,
  status public.enrollment_status NOT NULL DEFAULT 'active',
  access_type public.access_type NOT NULL DEFAULT 'manual',
  source text,
  granted_by uuid,
  granted_at timestamptz NOT NULL DEFAULT now(),
  starts_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT enrollments_scope_target_ck CHECK (
    (scope = 'course' AND course_id IS NOT NULL AND trail_id IS NULL) OR
    (scope = 'trail'  AND trail_id  IS NOT NULL AND course_id IS NULL)
  )
);
CREATE INDEX ON public.enrollments(user_id);
CREATE INDEX ON public.enrollments(course_id);
CREATE INDEX ON public.enrollments(trail_id);
CREATE UNIQUE INDEX enrollments_active_course_uk ON public.enrollments(user_id, course_id) WHERE scope = 'course' AND status = 'active';
CREATE UNIQUE INDEX enrollments_active_trail_uk  ON public.enrollments(user_id, trail_id)  WHERE scope = 'trail'  AND status = 'active';
GRANT SELECT ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner reads own enrollments" ON public.enrollments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage enrollments" ON public.enrollments FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

-- Helper: has_course_access
CREATE OR REPLACE FUNCTION private.has_course_access(_user_id uuid, _course_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, private AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments e
    WHERE e.user_id = _user_id
      AND e.status = 'active'
      AND (e.expires_at IS NULL OR e.expires_at > now())
      AND (
        (e.scope = 'course' AND e.course_id = _course_id) OR
        (e.scope = 'trail'  AND e.trail_id  = (SELECT trail_id FROM public.courses WHERE id = _course_id))
      )
  );
$$;
REVOKE EXECUTE ON FUNCTION private.has_course_access(uuid, uuid) FROM PUBLIC, anon, authenticated;

-- LESSON PROGRESS
CREATE TABLE public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status public.lesson_status NOT NULL DEFAULT 'not_started',
  progress_pct int NOT NULL DEFAULT 0,
  watch_time_sec int NOT NULL DEFAULT 0,
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
CREATE INDEX ON public.lesson_progress(user_id);
GRANT SELECT, INSERT, UPDATE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner rw own progress" ON public.lesson_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read all progress" ON public.lesson_progress FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'));

-- COURSE PROGRESS (aggregate)
CREATE TABLE public.course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  pct_complete int NOT NULL DEFAULT 0,
  lessons_completed int NOT NULL DEFAULT 0,
  lessons_total int NOT NULL DEFAULT 0,
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
CREATE INDEX ON public.course_progress(user_id);
GRANT SELECT ON public.course_progress TO authenticated;
GRANT ALL ON public.course_progress TO service_role;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner reads own course progress" ON public.course_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all course progress" ON public.course_progress FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'));

-- CERTIFICATES
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  trail_id uuid REFERENCES public.trails(id) ON DELETE SET NULL,
  certificate_code text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(9),'hex'),
  issued_at timestamptz NOT NULL DEFAULT now(),
  pdf_url text,
  CONSTRAINT certificates_target_ck CHECK (course_id IS NOT NULL OR trail_id IS NOT NULL)
);
CREATE INDEX ON public.certificates(user_id);
GRANT SELECT ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner reads own certificates" ON public.certificates FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage certificates" ON public.certificates FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

-- Trigger: recalcula course_progress quando lesson_progress muda
CREATE OR REPLACE FUNCTION public.recalc_course_progress()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_course_id uuid;
  v_total int;
  v_done int;
  v_pct int;
BEGIN
  SELECT c.id INTO v_course_id
  FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.courses c ON c.id = m.course_id
  WHERE l.id = COALESCE(NEW.lesson_id, OLD.lesson_id);

  IF v_course_id IS NULL THEN RETURN NEW; END IF;

  SELECT COUNT(*) INTO v_total
  FROM public.lessons l JOIN public.modules m ON m.id = l.module_id
  WHERE m.course_id = v_course_id;

  SELECT COUNT(*) INTO v_done
  FROM public.lesson_progress lp
  JOIN public.lessons l ON l.id = lp.lesson_id
  JOIN public.modules m ON m.id = l.module_id
  WHERE m.course_id = v_course_id
    AND lp.user_id = COALESCE(NEW.user_id, OLD.user_id)
    AND lp.status = 'completed';

  v_pct := CASE WHEN v_total = 0 THEN 0 ELSE (v_done * 100 / v_total) END;

  INSERT INTO public.course_progress (user_id, course_id, pct_complete, lessons_completed, lessons_total, completed_at, updated_at)
  VALUES (COALESCE(NEW.user_id, OLD.user_id), v_course_id, v_pct, v_done, v_total,
          CASE WHEN v_pct = 100 THEN now() ELSE NULL END, now())
  ON CONFLICT (user_id, course_id) DO UPDATE
    SET pct_complete = EXCLUDED.pct_complete,
        lessons_completed = EXCLUDED.lessons_completed,
        lessons_total = EXCLUDED.lessons_total,
        completed_at = EXCLUDED.completed_at,
        updated_at = now();

  -- Emite certificado ao completar 100%
  IF v_pct = 100 THEN
    INSERT INTO public.certificates (user_id, course_id)
    VALUES (COALESCE(NEW.user_id, OLD.user_id), v_course_id)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_recalc_course_progress
AFTER INSERT OR UPDATE OR DELETE ON public.lesson_progress
FOR EACH ROW EXECUTE FUNCTION public.recalc_course_progress();

-- updated_at triggers
CREATE TRIGGER trg_enrollments_updated BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_lesson_progress_updated BEFORE UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
