-- 1) Fix tg_audit_row so tables without user_id (trails/courses/lessons)
--    can be modified without runtime errors resolving NEW.user_id.
CREATE OR REPLACE FUNCTION public.tg_audit_row()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    IF v_entity IN ('enrollments','certificates') THEN
      v_target := NEW.user_id;
    END IF;
    v_new := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    v_entity_id := NEW.id;
    IF v_entity IN ('enrollments','certificates') THEN
      v_target := NEW.user_id;
    END IF;
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
    IF v_entity IN ('enrollments','certificates') THEN
      v_target := OLD.user_id;
    END IF;
    v_old := to_jsonb(OLD);
  END IF;

  IF v_actor IS NOT NULL THEN
    INSERT INTO public.admin_audit_log(actor_id, action, entity_type, entity_id, target_user_id, metadata, old_data, new_data)
    VALUES (v_actor, v_action, v_entity, v_entity_id, v_target, v_meta, v_old, v_new);
  END IF;
  RETURN COALESCE(NEW, OLD);
END $function$;

-- 2) Seed demo trail + demo public certificate
INSERT INTO public.trails (id, slug, name, status, order_index, is_free)
VALUES (
  '00000000-0000-0000-0000-0000000000e1',
  'demo-formacao-modelo',
  'Tropa Científica — Formação Modelo',
  'draft',
  999,
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.certificates (
  user_id,
  trail_id,
  certificate_code,
  student_name,
  course_title,
  trail_name,
  hours,
  issuer,
  status,
  issued_at
) VALUES (
  '00000000-0000-0000-0000-0000000000e2',
  '00000000-0000-0000-0000-0000000000e1',
  'TROPA-ELITE-2026',
  'Modelo Elite Tropa Científica',
  'Certificado Demonstrativo Premium Elite',
  'Tropa Científica — Formação Modelo',
  40,
  'Tropa Científica',
  'valid',
  '2026-07-03 12:00:00-03'
)
ON CONFLICT (certificate_code) DO NOTHING;