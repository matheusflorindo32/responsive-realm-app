-- Immutable operational trace for the two records created in the JARVIS workspace.
-- The trigger stores only useful non-sensitive fields; it never serializes metadata.
create or replace function jarvis_internal.audit_project_or_task_change()
returns trigger
language plpgsql
security definer
set search_path = public, jarvis_internal
as $$
declare
  current_row jsonb := to_jsonb(coalesce(new, old));
  event_action text := case tg_op when 'INSERT' then 'created' when 'UPDATE' then 'updated' else 'deleted' end;
begin
  insert into public.jarvis_audit_events (actor_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    lower(tg_table_name) || '_' || event_action,
    lower(tg_table_name),
    coalesce(new.id, old.id),
    jsonb_strip_nulls(jsonb_build_object(
      'code', current_row ->> 'code',
      'title', current_row ->> 'title',
      'status', current_row ->> 'status',
      'operation', tg_op
    ))
  );
  return coalesce(new, old);
end;
$$;
revoke all on function jarvis_internal.audit_project_or_task_change() from public;
revoke all on function jarvis_internal.audit_project_or_task_change() from anon;
revoke all on function jarvis_internal.audit_project_or_task_change() from authenticated;
create trigger jarvis_projects_audit_change
after insert or update or delete on public.jarvis_projects
for each row execute function jarvis_internal.audit_project_or_task_change();
create trigger jarvis_tasks_audit_change
after insert or update or delete on public.jarvis_tasks
for each row execute function jarvis_internal.audit_project_or_task_change();