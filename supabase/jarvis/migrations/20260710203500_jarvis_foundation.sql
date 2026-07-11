-- JARVIS Command Center: independent operational foundation.
-- This migration targets the personal Supabase project, not the legacy Lovable Cloud database.

create type public.jarvis_role as enum ('admin', 'operator', 'editor', 'viewer');
create type public.jarvis_project_phase as enum ('idea', 'validation', 'planning', 'production', 'review', 'published', 'operation', 'maintenance', 'paused', 'closed');
create type public.jarvis_task_status as enum ('backlog', 'next', 'in_progress', 'blocked', 'waiting', 'done', 'cancelled');
create type public.jarvis_registry_status as enum ('draft', 'active', 'paused', 'archived');

create table public.jarvis_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  locale text not null default 'pt-BR' check (locale in ('pt-BR', 'en', 'es')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jarvis_user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.jarvis_role not null default 'viewer',
  granted_at timestamptz not null default now()
);

create or replace function public.jarvis_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.jarvis_user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.jarvis_is_admin() from public;
grant execute on function public.jarvis_is_admin() to authenticated;

create or replace function public.jarvis_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.jarvis_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.jarvis_profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'))
  on conflict (id) do nothing;

  insert into public.jarvis_user_roles (user_id, role)
  values (new.id, 'viewer')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke all on function public.jarvis_handle_new_user() from public;

create trigger jarvis_on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.jarvis_handle_new_user();

create or replace function public.jarvis_bootstrap_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  perform pg_advisory_xact_lock(hashtext('jarvis_bootstrap_admin'));

  if exists (select 1 from public.jarvis_user_roles where role = 'admin') then
    return false;
  end if;

  insert into public.jarvis_user_roles (user_id, role)
  values (current_user_id, 'admin')
  on conflict (user_id) do update set role = excluded.role, granted_at = now();

  return true;
end;
$$;

revoke all on function public.jarvis_bootstrap_admin() from public;
grant execute on function public.jarvis_bootstrap_admin() to authenticated;

create table public.jarvis_projects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  objective text,
  audience text,
  phase public.jarvis_project_phase not null default 'idea',
  priority smallint not null default 3 check (priority between 1 and 5),
  next_action text,
  next_action_at timestamptz,
  source_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jarvis_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.jarvis_projects(id) on delete set null,
  code text not null unique,
  title text not null,
  status public.jarvis_task_status not null default 'backlog',
  priority smallint not null default 3 check (priority between 1 and 5),
  due_at timestamptz,
  source_ref text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jarvis_skills (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  purpose text not null,
  location text,
  status public.jarvis_registry_status not null default 'draft',
  last_validated_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jarvis_agents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  responsibility text not null,
  status public.jarvis_registry_status not null default 'draft',
  last_run_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jarvis_systems (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  kind text not null,
  environment text not null default 'production',
  public_url text,
  repository_url text,
  provider text,
  status public.jarvis_registry_status not null default 'draft',
  last_verified_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jarvis_decisions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  project_id uuid references public.jarvis_projects(id) on delete set null,
  subject text not null,
  decision text not null,
  rationale text,
  decided_at timestamptz not null default now(),
  source_ref text,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jarvis_sources (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.jarvis_projects(id) on delete set null,
  source_type text not null,
  title text not null,
  canonical_url text,
  version_label text,
  published_at date,
  verified_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jarvis_audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null default auth.uid(),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index jarvis_tasks_project_status_idx on public.jarvis_tasks (project_id, status, due_at);
create index jarvis_projects_phase_priority_idx on public.jarvis_projects (phase, priority, next_action_at);
create index jarvis_sources_project_idx on public.jarvis_sources (project_id, verified_at desc);

alter table public.jarvis_profiles enable row level security;
alter table public.jarvis_user_roles enable row level security;
alter table public.jarvis_projects enable row level security;
alter table public.jarvis_tasks enable row level security;
alter table public.jarvis_skills enable row level security;
alter table public.jarvis_agents enable row level security;
alter table public.jarvis_systems enable row level security;
alter table public.jarvis_decisions enable row level security;
alter table public.jarvis_sources enable row level security;
alter table public.jarvis_audit_events enable row level security;

create policy "jarvis profiles: read own" on public.jarvis_profiles for select to authenticated using (id = (select auth.uid()));
create policy "jarvis profiles: update own" on public.jarvis_profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "jarvis profiles: admin all" on public.jarvis_profiles for all to authenticated using ((select public.jarvis_is_admin())) with check ((select public.jarvis_is_admin()));
create policy "jarvis roles: read own" on public.jarvis_user_roles for select to authenticated using (user_id = (select auth.uid()));
create policy "jarvis roles: admin all" on public.jarvis_user_roles for all to authenticated using ((select public.jarvis_is_admin())) with check ((select public.jarvis_is_admin()));

create policy "jarvis projects: admin all" on public.jarvis_projects for all to authenticated using ((select public.jarvis_is_admin())) with check ((select public.jarvis_is_admin()));
create policy "jarvis tasks: admin all" on public.jarvis_tasks for all to authenticated using ((select public.jarvis_is_admin())) with check ((select public.jarvis_is_admin()));
create policy "jarvis skills: admin all" on public.jarvis_skills for all to authenticated using ((select public.jarvis_is_admin())) with check ((select public.jarvis_is_admin()));
create policy "jarvis agents: admin all" on public.jarvis_agents for all to authenticated using ((select public.jarvis_is_admin())) with check ((select public.jarvis_is_admin()));
create policy "jarvis systems: admin all" on public.jarvis_systems for all to authenticated using ((select public.jarvis_is_admin())) with check ((select public.jarvis_is_admin()));
create policy "jarvis decisions: admin all" on public.jarvis_decisions for all to authenticated using ((select public.jarvis_is_admin())) with check ((select public.jarvis_is_admin()));
create policy "jarvis sources: admin all" on public.jarvis_sources for all to authenticated using ((select public.jarvis_is_admin())) with check ((select public.jarvis_is_admin()));
create policy "jarvis audit: admin read" on public.jarvis_audit_events for select to authenticated using ((select public.jarvis_is_admin()));
create policy "jarvis audit: admin insert" on public.jarvis_audit_events for insert to authenticated with check ((select public.jarvis_is_admin()));

create trigger jarvis_profiles_updated_at before update on public.jarvis_profiles for each row execute procedure public.jarvis_set_updated_at();
create trigger jarvis_projects_updated_at before update on public.jarvis_projects for each row execute procedure public.jarvis_set_updated_at();
create trigger jarvis_tasks_updated_at before update on public.jarvis_tasks for each row execute procedure public.jarvis_set_updated_at();
create trigger jarvis_skills_updated_at before update on public.jarvis_skills for each row execute procedure public.jarvis_set_updated_at();
create trigger jarvis_agents_updated_at before update on public.jarvis_agents for each row execute procedure public.jarvis_set_updated_at();
create trigger jarvis_systems_updated_at before update on public.jarvis_systems for each row execute procedure public.jarvis_set_updated_at();
create trigger jarvis_decisions_updated_at before update on public.jarvis_decisions for each row execute procedure public.jarvis_set_updated_at();
create trigger jarvis_sources_updated_at before update on public.jarvis_sources for each row execute procedure public.jarvis_set_updated_at();
