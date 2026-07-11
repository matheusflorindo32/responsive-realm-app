-- First operational task: activation of the administrative account and MFA.

insert into public.jarvis_tasks (project_id, code, title, status, priority, source_ref, metadata)
select id, 'JARVIS-001', 'Criar primeira conta administrativa e validar MFA AAL2', 'next', 1, 'jarvis-foundation', '{"kind":"security-onboarding","requires_human_action":true}'::jsonb
from public.jarvis_projects
where code = 'JARVIS-OS'
on conflict (code) do update set
  title = excluded.title,
  status = excluded.status,
  priority = excluded.priority,
  source_ref = excluded.source_ref,
  metadata = public.jarvis_tasks.metadata || excluded.metadata;
