
# Elevação Premium — Fases 3, 5, 7 + reforços em 1/2/4/6

Muito do escopo já foi entregue no turno anterior (auditoria, dashboard premium, certificados públicos, schema de pagamento idempotente, RLS por trilha). Este plano cobre **apenas as lacunas restantes**, incremental e sem quebrar nada.

## Fase 1 — Reforços de segurança e governança

**Backend (1 migração aditiva):**
- **Bloquear progresso sem matrícula ativa** — trigger `BEFORE INSERT/UPDATE` em `lesson_progress` que rejeita se `private.has_course_access(user_id, course_id)` retornar false. Hoje só a RLS protege leitura; falta enforcement na escrita.
- **Bloquear leitura de conteúdo real** — reafirmar policy em `lessons` para que `video_url/content_md/attachments` só apareçam a quem tem enrollment ativo, admin, instrutor ou `is_preview=true`. (Metadados como título/ordem seguem públicos para o catálogo.)
- **Enriquecer `admin_audit_log`** — adicionar `ip_address inet`, `user_agent text`, `old_data jsonb`, `new_data jsonb`. Ajustar `tg_audit_row` para gravar snapshots antigos/novos separados (INSERT: só new; UPDATE: old+new; DELETE: só old).
- **Auditoria de certificados** — trigger de auditoria em `certificates` para registrar emissão e revogação.

## Fase 3 — Player de aulas premium (novo, principal entrega)

Redesign completo de `/app/curso/:slug` mantendo API atual:

**Layout desktop** (2 colunas):
```
┌── vídeo/conteúdo ──────────────┬── sidebar ──┐
│  [player 16:9]                  │ Módulo 1    │
│  [breadcrumb curso > aula]      │  ✓ Aula 1   │
│  [título + descrição]           │  ▶ Aula 2   │
│  [progresso curso + módulo]     │  🔒 Aula 3  │
│  [tabs: sobre / materiais /     │ Módulo 2    │
│         anotações]              │  ○ Aula 4   │
│  [botão marcar concluída]       │             │
│  [próxima aula ▶]               │             │
└─────────────────────────────────┴─────────────┘
```
Mobile: sidebar vira sheet lateral com trigger no header.

**Componentes novos em `src/components/player/`:**
- `LessonSidebar.tsx` — módulos colapsáveis, ícone por estado (concluída, em andamento, disponível, bloqueada), progresso por módulo.
- `VideoPlayer.tsx` — detecta YouTube/Vimeo/URL direta; fallback elegante ("Não foi possível carregar o vídeo — tente recarregar"); aspect-ratio 16:9.
- `LessonTabs.tsx` — três abas: **Sobre** (descrição + duração + instrutor), **Materiais** (lista de `attachments` com download), **Minhas anotações** (textarea salva no banco).
- `LessonActions.tsx` — botão principal "Marcar como concluída" (verde quando feito) + "Próxima aula" navegando para próxima em ordem.
- `LessonLocked.tsx` — quando aluno acessa aula sem enrollment (curso expirado), mostra estado bloqueado com CTA "Solicitar acesso".

**Nova tabela `lesson_notes`** (anotações privadas):
- `user_id`, `lesson_id`, `content text`, `updated_at`
- RLS: dono ALL próprio; admin SELECT.
- Único por (user_id, lesson_id).

**Enforcement no player:** carrega enrollment do curso; se `status != active` ou `expires_at < now()`, esconde `video_url/content_md` e renderiza `LessonLocked`.

## Fase 4 — Certificados: complementos

- Adicionar campo `issuer text` em `certificates` (default "Tropa Científica").
- Adicionar `trail_name` snapshot.
- Estender `verify_certificate` para incluir issuer e trail_name.
- **Página admin `/admin/ensino/certificados`** — tabela paginada, filtro por curso/aluno/status, botão **Revogar** com motivo (input) → grava `revoked_at`, `revoked_reason`, dispara auditoria.

## Fase 5 — Admin premium (complementos)

**Hub com métricas** (`/admin/ensino`): substituir Hub atual por dashboard bento com:
- Total de alunos únicos (COUNT DISTINCT profiles)
- Matrículas ativas / expiradas / expirando (< 15d)
- Cursos publicados / rascunho
- Trilhas publicadas
- Certificados emitidos (30d / total)
- Alunos com progresso ≥ 50% em algum curso
- Alunos inativos (sem lesson_progress em 30d)

Query única via RPC `admin_metrics()` (SECURITY DEFINER, restrita a admin).

**Gestão de cursos enriquecida** — refatorar `/admin/ensino/cursos/:id` com formulário completo dos novos campos:
- level (select: iniciante/intermediário/avançado)
- duration_min, instructor_name, cover_url, trailer_url
- requirements[], target_audience[], learning_objectives[] (input tags)
- materials (jsonb — array de {label, url})
- status (draft/published/archived)
- Ordem manual de módulos e lições via botões ▲▼ (drag-and-drop fica para depois).

## Fase 6 — Pagamentos: complementos

- Adicionar valores ao enum `payment_status`: `chargeback`, `cancelled`.
- Adicionar `access_type` valor `subscription`, `partnership` ao enum `access_type`.
- Estender `grant_enrollment_from_payment` para: se pagamento vira `refunded/chargeback/cancelled`, marcar enrollment relacionado como `revoked` (função `revoke_enrollment_from_payment`).

## Fase 7 — Qualidade técnica (leve, sem overengineering)

**Frontend:**
- **ErrorBoundary global** em `src/components/ErrorBoundary.tsx`; envolve `<App>` em `main.tsx`.
- **ErrorBoundary específico 3D** em `TropaLogo3D` para não derrubar a home se WebGL falhar.
- **Lazy loading** com `React.lazy` + `Suspense` para páginas pesadas: rotas admin, área do aluno, player, certificado público. Fallback com skeleton.
- **Skeleton loaders** — `src/components/app/DashboardSkeleton.tsx`, `PlayerSkeleton.tsx`, `TableSkeleton.tsx`. Aplicar nas queries com `isLoading`.
- **Toast unificado de erro Supabase** — util `handleSupabaseError(error)` que mostra mensagem legível em pt-BR.

**Testes (setup mínimo):**
- Configurar Vitest + Testing Library conforme o guia (`vitest.config.ts`, `src/test/setup.ts`).
- Testes iniciais:
  - `AccessStatusBadge.test.tsx` — renderiza cada estado corretamente.
  - `CourseCard.test.tsx` — mostra progresso e status.
  - `verify_certificate.test.tsx` — página pública renderiza dados válidos e mostra "não encontrado" quando nulo.
- Sem CI para não sair do escopo; rodar localmente.

## Ordem de execução (incremental, cada etapa deploy-safe)

1. **Migração de reforços** — trigger de progresso, auditoria enriquecida, `lesson_notes`, campo `issuer`, enums de pagamento, RPC `admin_metrics`.
2. **Player premium** — sidebar, tabs, anotações, materiais, bloqueio.
3. **Admin Hub com métricas** + tela de **Certificados admin** com revogação.
4. **Gestão de cursos enriquecida** — formulário completo.
5. **Qualidade** — ErrorBoundary, lazy loading, skeletons, util de erro.
6. **Testes iniciais** — setup + 3 suites.

## Fora de escopo (confirmado)

Backend Node.js separado, JWT próprio, Next.js, Redis, Docker, Swagger, refatoração total, drag-and-drop de módulos, geração real de PDF (fica visual/print), CI/CD novo.

## Perguntas rápidas

1. **Anotações do aluno** — texto simples com autosave (debounce 1s) ou botão "salvar" explícito? *(assumo autosave — mais premium)*
2. **Bloqueio quando expirado** — o aluno perde acesso a **certificado já emitido** também? *(assumo NÃO — certificado é vitalício mesmo com enrollment expirado)*
3. **Métricas admin** — período fixo "últimos 30 dias" para inativos/emitidos, ou filtro por range? *(assumo fixo 30d agora, filtro depois)*
