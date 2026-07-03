
-- ENUMS
CREATE TYPE public.content_status AS ENUM ('draft','published','archived');
CREATE TYPE public.lesson_content_type AS ENUM ('video','text','quiz','file');
CREATE TYPE public.trail_role AS ENUM ('instructor','moderator','student');

-- TRAILS
CREATE TABLE public.trails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  cover_url text,
  color text,
  status public.content_status NOT NULL DEFAULT 'draft',
  order_index int NOT NULL DEFAULT 0,
  price_cents int NOT NULL DEFAULT 0,
  is_free boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.trails TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.trails TO authenticated;
GRANT ALL ON public.trails TO service_role;
ALTER TABLE public.trails ENABLE ROW LEVEL SECURITY;

-- TRAIL MEMBERSHIPS (needs to exist before helper function)
CREATE TABLE public.trail_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  trail_id uuid NOT NULL REFERENCES public.trails(id) ON DELETE CASCADE,
  role public.trail_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, trail_id, role)
);
CREATE INDEX ON public.trail_memberships(user_id);
CREATE INDEX ON public.trail_memberships(trail_id);
GRANT SELECT ON public.trail_memberships TO authenticated;
GRANT ALL ON public.trail_memberships TO service_role;
ALTER TABLE public.trail_memberships ENABLE ROW LEVEL SECURITY;

-- Helper: has_trail_role
CREATE OR REPLACE FUNCTION private.has_trail_role(_user_id uuid, _trail_id uuid, _role public.trail_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, private AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.trail_memberships
    WHERE user_id = _user_id AND trail_id = _trail_id AND role = _role
  );
$$;

-- Policies for trails and memberships
CREATE POLICY "Public reads published trails" ON public.trails FOR SELECT USING (status = 'published' OR private.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage trails" ON public.trails FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

CREATE POLICY "User reads own memberships" ON public.trail_memberships FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage memberships" ON public.trail_memberships FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

-- COURSES
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trail_id uuid NOT NULL REFERENCES public.trails(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text,
  description text,
  cover_url text,
  level text,
  duration_min int,
  status public.content_status NOT NULL DEFAULT 'draft',
  order_index int NOT NULL DEFAULT 0,
  price_cents int NOT NULL DEFAULT 0,
  is_free boolean NOT NULL DEFAULT false,
  instructor_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.courses(trail_id);
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published courses" ON public.courses FOR SELECT USING (status = 'published' OR private.has_role(auth.uid(),'admin') OR instructor_id = auth.uid());
CREATE POLICY "Admins manage courses" ON public.courses FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE POLICY "Instructors update own trail courses" ON public.courses FOR UPDATE TO authenticated USING (private.has_trail_role(auth.uid(), trail_id, 'instructor')) WITH CHECK (private.has_trail_role(auth.uid(), trail_id, 'instructor'));

-- MODULES
CREATE TABLE public.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.modules(course_id);
GRANT SELECT ON public.modules TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.modules TO authenticated;
GRANT ALL ON public.modules TO service_role;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads modules of published courses" ON public.modules FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND (c.status = 'published' OR private.has_role(auth.uid(),'admin')))
);
CREATE POLICY "Admins manage modules" ON public.modules FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

-- LESSONS
CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  content_type public.lesson_content_type NOT NULL DEFAULT 'video',
  video_url text,
  content_md text,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  duration_sec int,
  order_index int NOT NULL DEFAULT 0,
  is_preview boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (module_id, slug)
);
CREATE INDEX ON public.lessons(module_id);
GRANT SELECT ON public.lessons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads lesson metadata" ON public.lessons FOR SELECT USING (
  is_preview
  OR private.has_role(auth.uid(),'admin')
  OR EXISTS (
    SELECT 1 FROM public.modules m JOIN public.courses c ON c.id = m.course_id
    WHERE m.id = module_id AND c.status = 'published'
  )
);
CREATE POLICY "Admins manage lessons" ON public.lessons FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  display_name text,
  avatar_url text,
  bio text,
  city text,
  is_public boolean NOT NULL DEFAULT false,
  public_slug text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner reads own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Public reads public profiles" ON public.profiles FOR SELECT USING (is_public = true);
CREATE POLICY "Admins read all profiles" ON public.profiles FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'));
CREATE POLICY "Owner updates own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner inserts own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Auto-cria profile no signup
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- updated_at triggers
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_trails_updated BEFORE UPDATE ON public.trails FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_courses_updated BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_modules_updated BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_lessons_updated BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
