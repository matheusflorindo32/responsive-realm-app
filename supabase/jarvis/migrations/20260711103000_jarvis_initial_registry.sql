-- Seed the initial JARVIS registry without credentials or private vault content.

insert into public.jarvis_projects (code, title, objective, audience, phase, priority, next_action, metadata)
values ('JARVIS-OS', 'JARVIS Command Center', 'Centralizar decisões, projetos, conhecimento, agentes e operação digital com segurança e rastreabilidade.', 'Operação pessoal, clientes, alunos e parceiros autorizados', 'production', 1, 'Ativar a primeira conta administrativa e validar MFA AAL2', '{"scope":"command-center","source":"codex-foundation"}'::jsonb)
on conflict (code) do update set title = excluded.title, objective = excluded.objective, audience = excluded.audience, phase = excluded.phase, priority = excluded.priority, next_action = excluded.next_action, metadata = public.jarvis_projects.metadata || excluded.metadata;

insert into public.jarvis_skills (slug, title, purpose, location, status, metadata)
values
  ('orquestrar-ecossistema-matheus', 'Orquestrar ecossistema', 'Rotear e coordenar trabalhos entre pesquisa, ensino, produtos, conteúdo e tecnologia.', 'remote-skills/orquestrar-ecossistema-matheus', 'active', '{"domain":"orchestration"}'),
  ('evoluir-biblioteca-de-skills', 'Evoluir biblioteca de skills', 'Identificar, criar, testar e aperfeiçoar habilidades reutilizáveis.', 'remote-skills/evoluir-biblioteca-de-skills', 'active', '{"domain":"knowledge"}'),
  ('desenvolver-frontend-elite-21st', 'Frontend Elite 21st', 'Criar interfaces premium, acessíveis e responsivas com referências de alta qualidade.', 'remote-skills/desenvolver-frontend-elite-21st', 'active', '{"domain":"product-design"}'),
  ('revisar-evidencias-cientificas', 'Revisar evidências científicas', 'Auditar evidências, estrutura, referências e revisão por pares.', 'remote-skills/revisar-evidencias-cientificas', 'active', '{"domain":"research"}'),
  ('monitorar-partiu-ifes', 'Monitorar Partiu IFES', 'Acompanhar editais, provas, documentos e mudanças públicas relacionadas ao programa.', 'remote-skills/monitorar-partiu-ifes', 'active', '{"domain":"education"}'),
  ('construir-banco-questoes-ifes', 'Construir banco de questões IFES', 'Extrair, validar, classificar e analisar questões de provas.', 'remote-skills/construir-banco-questoes-ifes', 'active', '{"domain":"education"}'),
  ('gerenciar-portfolio-digital', 'Gerenciar portfólio digital', 'Inventariar sites, apps, APIs, repositórios, deploys, domínios e bancos.', 'remote-skills/gerenciar-portfolio-digital', 'active', '{"domain":"technology"}'),
  ('gerenciar-clientes-e-alunos', 'Gerenciar clientes e alunos', 'Acompanhar relacionamento, entregas, turmas, progresso e suporte.', 'remote-skills/gerenciar-clientes-e-alunos', 'active', '{"domain":"operations"}'),
  ('operar-produtos-digitais', 'Operar produtos digitais', 'Estruturar, precificar, lançar, medir e melhorar produtos e serviços.', 'remote-skills/operar-produtos-digitais', 'active', '{"domain":"business"}'),
  ('produzir-conteudo-multicanal', 'Produzir conteúdo multicanal', 'Transformar conhecimento validado em conteúdo nativo para cada canal.', 'remote-skills/produzir-conteudo-multicanal', 'active', '{"domain":"content"}'),
  ('produzir-documentos-premium', 'Produzir documentos premium', 'Criar e verificar documentos profissionais em formatos reutilizáveis.', 'remote-skills/produzir-documentos-premium', 'active', '{"domain":"documentation"}')
on conflict (slug) do update set title = excluded.title, purpose = excluded.purpose, location = excluded.location, status = excluded.status, metadata = public.jarvis_skills.metadata || excluded.metadata;

insert into public.jarvis_agents (slug, title, responsibility, status, metadata)
values
  ('jarvis-orchestrator', 'JARVIS Orchestrator', 'Classificar demandas, selecionar skills, decompor trabalho e exigir portões de qualidade.', 'active', '{"tier":"control","human_approval":true}'),
  ('security-auditor', 'Security Auditor', 'Auditar autenticação, RLS, segredos, dependências, permissões e trilhas de auditoria.', 'active', '{"tier":"assurance"}'),
  ('research-reviewer', 'Research Reviewer', 'Organizar evidências, validar fontes e coordenar revisão científica por pares.', 'active', '{"tier":"specialist","domain":"research"}'),
  ('frontend-director', 'Frontend Director', 'Definir composição visual, design system, acessibilidade e qualidade de implementação.', 'active', '{"tier":"specialist","domain":"product-design"}'),
  ('data-steward', 'Data Steward', 'Proteger modelos canônicos, qualidade, proveniência, sincronização e deduplicação.', 'active', '{"tier":"assurance","domain":"data"}'),
  ('content-director', 'Content Director', 'Coordenar conteúdo-mestre e distribuição coerente entre canais.', 'active', '{"tier":"specialist","domain":"content"}'),
  ('operations-manager', 'Operations Manager', 'Acompanhar projetos, clientes, alunos, prazos, riscos e próximas ações.', 'active', '{"tier":"operations"}')
on conflict (slug) do update set title = excluded.title, responsibility = excluded.responsibility, status = excluded.status, metadata = public.jarvis_agents.metadata || excluded.metadata;

insert into public.jarvis_systems (code, name, kind, environment, public_url, repository_url, provider, status, metadata)
values
  ('JARVIS-WEB', 'JARVIS Command Center', 'web-app', 'staging', null, 'https://github.com/matheusflorindo32/responsive-realm-app', 'GitHub', 'active', '{"backend":"personal-supabase"}'),
  ('JARVIS-DB', 'JARVIS Personal Supabase', 'database-auth', 'production', 'https://wbfzqodfgvisiwmgpuaj.supabase.co', null, 'Supabase', 'active', '{"project_ref":"wbfzqodfgvisiwmgpuaj","plan":"free"}'),
  ('LOVABLE-LEGACY', 'Lovable Education Backend', 'legacy-backend', 'production', null, 'https://github.com/matheusflorindo32/responsive-realm-app', 'Lovable Cloud', 'active', '{"scope":"education","sync_mode":"isolated"}'),
  ('JARVIS-VAULT', 'Obsidian Vault JARVIS', 'knowledge-base', 'production', null, 'https://github.com/matheusflorindo32/Obesidian-vault', 'Obsidian/GitHub', 'active', '{"visibility":"private","sync_mode":"allowlist-export"}'),
  ('JARVIS-GITHUB', 'JARVIS Source Control', 'source-control', 'production', 'https://github.com/matheusflorindo32/responsive-realm-app', 'https://github.com/matheusflorindo32/responsive-realm-app', 'GitHub', 'active', '{"ci_node":22,"branch_protection":"pending"}')
on conflict (code) do update set name = excluded.name, kind = excluded.kind, environment = excluded.environment, public_url = excluded.public_url, repository_url = excluded.repository_url, provider = excluded.provider, status = excluded.status, metadata = public.jarvis_systems.metadata || excluded.metadata;
