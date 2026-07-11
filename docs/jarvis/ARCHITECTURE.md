# JARVIS Command Center — Arquitetura

## Decisão

Manter o site público, o portfólio, o LMS e o admin no mesmo repositório nesta fase. O domínio administrativo permanece isolado por rota, autenticação, MFA e RLS. A separação em outro app ou subdomínio só será necessária quando equipe, compliance ou ciclo de deploy justificarem.

## Responsabilidades

| Camada | Fonte de verdade | Responsabilidade |
| --- | --- | --- |
| Obsidian privado | conhecimento humano | notas, decisões, pesquisa, documentação e contexto |
| GitHub | código e revisão | branches, PRs, CI, manifestos sanitizados e histórico |
| Supabase | operação | usuários, projetos, tarefas, cursos, conteúdo, produtos, métricas e auditoria |
| /admin | interface | cockpit visual, triagem, decisões e ações aprovadas |
| Google Calendar/Gmail | dados externos | eventos e mensagens; o JARVIS guarda somente IDs e metadados mínimos |

## Regras

1. Nunca importar o vault inteiro.
2. Exportar somente notas de uma pasta allowlist, com frontmatter validado.
3. Nenhum corpo de e-mail, anexo, token ou dado sensível vai para o Git.
4. Fable, Codex e outros agentes trabalham em branches próprias.
5. Ações externas sensíveis exigem confirmação humana.
6. Supabase é protegido por RLS/RPC/Edge Functions; o guard React não é fronteira de segurança.
7. Cada entidade possui ID estável, revisão, checksum e fonte.

## Fases

1. Command Center e módulos-base.
2. Modelo canônico de projetos/tarefas/conteúdo/sistemas/agentes/riscos.
3. Piloto somente leitura com 10 projetos.
4. Export Obsidian → staging → promoção Supabase.
5. Calendário e e-mail em modo leitura.
6. Automações aprovadas e métricas multicanal.
