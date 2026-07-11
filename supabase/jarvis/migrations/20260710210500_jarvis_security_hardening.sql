-- Keep privileged JARVIS functions out of the Data API and remove public bootstrap access.

create schema if not exists jarvis_internal;
revoke all on schema jarvis_internal from public;

alter function public.jarvis_is_admin() set schema jarvis_internal;
alter function public.jarvis_set_updated_at() set schema jarvis_internal;
alter function public.jarvis_handle_new_user() set schema jarvis_internal;

revoke all on function jarvis_internal.jarvis_is_admin() from public, anon;
revoke all on function jarvis_internal.jarvis_set_updated_at() from public, anon, authenticated;
revoke all on function jarvis_internal.jarvis_handle_new_user() from public, anon, authenticated;
grant usage on schema jarvis_internal to authenticated;
grant execute on function jarvis_internal.jarvis_is_admin() to authenticated;

drop function public.jarvis_bootstrap_admin();

drop policy "jarvis profiles: read own" on public.jarvis_profiles;
drop policy "jarvis profiles: update own" on public.jarvis_profiles;
drop policy "jarvis profiles: admin all" on public.jarvis_profiles;
create policy "jarvis profiles: select" on public.jarvis_profiles for select to authenticated using (id = (select auth.uid()) or (select jarvis_internal.jarvis_is_admin()));
create policy "jarvis profiles: update" on public.jarvis_profiles for update to authenticated using (id = (select auth.uid()) or (select jarvis_internal.jarvis_is_admin())) with check (id = (select auth.uid()) or (select jarvis_internal.jarvis_is_admin()));
create policy "jarvis profiles: admin insert" on public.jarvis_profiles for insert to authenticated with check ((select jarvis_internal.jarvis_is_admin()));
create policy "jarvis profiles: admin delete" on public.jarvis_profiles for delete to authenticated using ((select jarvis_internal.jarvis_is_admin()));

drop policy "jarvis roles: read own" on public.jarvis_user_roles;
drop policy "jarvis roles: admin all" on public.jarvis_user_roles;
create policy "jarvis roles: select" on public.jarvis_user_roles for select to authenticated using (user_id = (select auth.uid()) or (select jarvis_internal.jarvis_is_admin()));
create policy "jarvis roles: admin insert" on public.jarvis_user_roles for insert to authenticated with check ((select jarvis_internal.jarvis_is_admin()));
create policy "jarvis roles: admin update" on public.jarvis_user_roles for update to authenticated using ((select jarvis_internal.jarvis_is_admin())) with check ((select jarvis_internal.jarvis_is_admin()));
create policy "jarvis roles: admin delete" on public.jarvis_user_roles for delete to authenticated using ((select jarvis_internal.jarvis_is_admin()));

create index jarvis_projects_created_by_idx on public.jarvis_projects (created_by);
create index jarvis_tasks_created_by_idx on public.jarvis_tasks (created_by);
create index jarvis_decisions_project_idx on public.jarvis_decisions (project_id);
create index jarvis_decisions_created_by_idx on public.jarvis_decisions (created_by);
create index jarvis_audit_events_actor_idx on public.jarvis_audit_events (actor_id);
