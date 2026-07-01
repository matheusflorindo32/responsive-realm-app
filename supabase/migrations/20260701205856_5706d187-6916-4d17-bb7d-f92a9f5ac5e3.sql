
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- First user becomes admin
CREATE OR REPLACE FUNCTION public.handle_first_user_admin()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_first_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_first_user_admin();

-- ============ SHEET ROWS (mirror universal) ============
CREATE TABLE public.sheet_rows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_name text NOT NULL,
  sheet_row_id text NOT NULL,            -- coluna "id" da aba ou fallback = "row:N"
  sheet_row_number int,                   -- linha física (1-based, header = 1)
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  source text NOT NULL DEFAULT 'sheets' CHECK (source IN ('app','sheets','system','import')),
  sync_status text NOT NULL DEFAULT 'synced'
    CHECK (sync_status IN ('synced','pending_push','pending_pull','error','conflict')),
  conflict_status text CHECK (conflict_status IN (NULL,'app_vs_sheet','resolved')),
  conflict_payload jsonb,
  error_message text,
  last_synced_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE (sheet_name, sheet_row_id)
);

CREATE INDEX idx_sheet_rows_sheet ON public.sheet_rows(sheet_name);
CREATE INDEX idx_sheet_rows_status ON public.sheet_rows(sync_status) WHERE sync_status <> 'synced';
CREATE INDEX idx_sheet_rows_updated ON public.sheet_rows(updated_at DESC);
CREATE INDEX idx_sheet_rows_data_gin ON public.sheet_rows USING gin (data);

GRANT SELECT ON public.sheet_rows TO authenticated;
GRANT ALL ON public.sheet_rows TO service_role;
ALTER TABLE public.sheet_rows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read sheet rows" ON public.sheet_rows
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Editors insert sheet rows" ON public.sheet_rows
  FOR INSERT TO authenticated WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
  );
CREATE POLICY "Editors update sheet rows" ON public.sheet_rows
  FOR UPDATE TO authenticated USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
  );
CREATE POLICY "Admins delete sheet rows" ON public.sheet_rows
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Trigger: bumps updated_at + marks pending_push when source=app
CREATE OR REPLACE FUNCTION public.sheet_rows_before_write()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.source = 'app' THEN
    NEW.sync_status = COALESCE(NULLIF(NEW.sync_status,'synced'),'pending_push');
    IF NEW.sync_status = 'synced' THEN NEW.sync_status = 'pending_push'; END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sheet_rows_before_write
BEFORE INSERT OR UPDATE ON public.sheet_rows
FOR EACH ROW EXECUTE FUNCTION public.sheet_rows_before_write();

-- ============ SYNC RUNS ============
CREATE TABLE public.sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger text NOT NULL CHECK (trigger IN ('webhook','cron','manual','startup')),
  direction text NOT NULL CHECK (direction IN ('pull','push','both')),
  sheet_name text,
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running','ok','partial','error')),
  rows_pulled int NOT NULL DEFAULT 0,
  rows_pushed int NOT NULL DEFAULT 0,
  conflicts int NOT NULL DEFAULT 0,
  errors jsonb,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  duration_ms int,
  triggered_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_sync_runs_started ON public.sync_runs(started_at DESC);
CREATE INDEX idx_sync_runs_status ON public.sync_runs(status);

GRANT SELECT ON public.sync_runs TO authenticated;
GRANT ALL ON public.sync_runs TO service_role;
ALTER TABLE public.sync_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read sync runs" ON public.sync_runs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ CONFLICTS ============
CREATE TABLE public.sync_conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_row_id uuid NOT NULL REFERENCES public.sheet_rows(id) ON DELETE CASCADE,
  app_version jsonb NOT NULL,
  sheet_version jsonb NOT NULL,
  app_updated_at timestamptz,
  sheet_updated_at timestamptz,
  resolved boolean NOT NULL DEFAULT false,
  resolution text CHECK (resolution IN (NULL,'kept_app','kept_sheet','merged')),
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_conflicts_unresolved ON public.sync_conflicts(created_at DESC) WHERE resolved = false;

GRANT SELECT, UPDATE ON public.sync_conflicts TO authenticated;
GRANT ALL ON public.sync_conflicts TO service_role;
ALTER TABLE public.sync_conflicts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read conflicts" ON public.sync_conflicts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins resolve conflicts" ON public.sync_conflicts
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
