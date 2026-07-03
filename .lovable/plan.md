# Arquitetura de Ensino — Tropa Científica

Modelo relacional robusto e escalável. Primeira versão: liberação manual pelo admin. Já preparado para Stripe/Mercado Pago no futuro, perfil público opcional, papéis por nicho e comunidade.

## Visão geral

```text
trails (trilhas/nichos)
  └── courses (cursos)
        └── modules (módulos)
              └── lessons (aulas)

profiles (dados públicos opcionais do aluno)
user_roles (admin global, editor)
trail_memberships (papel do usuário POR nicho: instrutor, moderador, aluno)

enrollments (matrícula em curso OU trilha inteira)
lesson_progress (progresso por aula)
certificates (emitidos ao concluir)

payments (histórico — nulo hoje, populado quando Stripe/MP entrar)
```

## Tabelas

### 1. Conteúdo

- **`trails`** — nichos. Campos: `slug`, `name`, `description`, `cover_url`, `color`, `status` (draft/published), `order_index`, `price_cents` (trilha inteira), `is_free`.
- **`courses`** — cursos individuais. `trail_id` (FK), `slug`, `title`, `summary`, `description`, `cover_url`, `level`, `duration_min`, `status`, `order_index`, `price_cents`, `is_free`, `instructor_id` (FK → auth.users, opcional).
- **`modules`** — agrupamento dentro de curso. `course_id`, `title`, `order_index`.
- **`lessons`** — `module_id`, `title`, `slug`, `content_type` (video/text/quiz/file), `video_url`, `content_md`, `attachments` (jsonb), `duration_sec`, `order_index`, `is_preview` (aula grátis de amostra).

### 2. Usuários e papéis

- **`profiles`** — `user_id` (FK auth.users, unique), `display_name`, `avatar_url`, `bio`, `city`, `is_public` (default false — perfil privado até o usuário optar), `public_slug` (nullable, unique). Trigger cria automaticamente no signup.
- **`user_roles`** (já existe) — papéis globais: `admin`, `editor`, `viewer`.
- **`trail_memberships`** — papel POR trilha. `user_id`, `trail_id`, `role` enum (`instructor`, `moderator`, `student`). Permite instrutor específico por nicho sem virar admin global.

### 3. Matrículas e acesso

- **`enrollments`** — porta única de acesso ao conteúdo.
  - `user_id`, `scope` enum (`course`, `trail`), `course_id` nullable, `trail_id` nullable (só um preenchido conforme scope, via CHECK).
  - `status` enum: `pending`, `active`, `expired`, `revoked`, `refunded`.
  - `access_type` enum: `manual`, `purchase`, `gift`, `trial`, `scholarship`.
  - `source` text (ex: `admin:matheus`, `stripe:pi_xxx`, `mercadopago:xxx`).
  - `granted_by` (FK auth.users — quem liberou), `granted_at`, `starts_at`, `expires_at` (null = vitalício).
  - `payment_id` FK nullable → `payments`.
  - Índice único parcial: um enrollment ativo por (user, course) e (user, trail).

### 4. Progresso e conquistas

- **`lesson_progress`** — `user_id`, `lesson_id`, `status` (not_started/in_progress/completed), `progress_pct`, `completed_at`, `watch_time_sec`. Unique(user, lesson).
- **`course_progress`** (view materializada ou tabela agregada atualizada por trigger) — `user_id`, `course_id`, `pct_complete`, `completed_at`.
- **`certificates`** — `user_id`, `course_id` ou `trail_id`, `issued_at`, `certificate_code` (unique, para verificação pública), `pdf_url`.

### 5. Pagamentos (esqueleto para o futuro)

- **`payments`** — `user_id`, `provider` enum (`manual`, `stripe`, `mercadopago`), `provider_ref`, `amount_cents`, `currency`, `status` (pending/paid/failed/refunded), `raw` jsonb (webhook payload), `paid_at`.
- Não há integração hoje. Admin cria `enrollment` com `access_type='manual'`; quando Stripe/MP entrar, o webhook cria um `payment` e um `enrollment` linkados.

## Segurança (RLS)

Padrão: tudo negado, políticas específicas liberam.

- **Conteúdo publicado** (`trails`, `courses`, `modules`, `lessons` com `status='published'`) — leitura pública apenas de metadados; **conteúdo real de aula** (video_url, content_md) só liberado se usuário tem enrollment ativo OU aula é `is_preview=true` OU é instrutor da trilha OU admin.
- **`enrollments`** — usuário lê os próprios; admin lê/escreve tudo; instrutor lê os do seu nicho.
- **`lesson_progress`** — usuário lê/escreve o próprio; instrutor da trilha lê (read-only) para acompanhar turma.
- **`profiles`** — dono lê/edita o próprio; leitura pública SÓ quando `is_public=true` (via policy condicional).
- **`certificates`** — dono lê os próprios; verificação pública por `certificate_code` via edge function (não pela tabela).
- **`payments`** — apenas admin e dono.

Todos os checks usam `private.has_role(auth.uid(), 'admin')` e uma nova função `private.has_trail_role(_user, _trail, _role)` SECURITY DEFINER para evitar recursão.

## Painel admin (`/admin/ensino`)

Rotas novas, protegidas por admin:
- `/admin/ensino/trilhas` — CRUD.
- `/admin/ensino/cursos` — CRUD, drag-to-reorder módulos/aulas.
- `/admin/ensino/alunos` — listar usuários, ver matrículas, **liberar acesso manual** (form: usuário + curso/trilha + expiração opcional).
- `/admin/ensino/matriculas` — auditoria de todas as enrollments com filtros.

## Área do aluno (`/app`)

- `/app` — dashboard com trilhas e cursos liberados, progresso, próximas aulas.
- `/app/curso/:slug` — player + lista de aulas + progresso.
- `/app/certificados`.
- `/app/perfil` — editar dados, toggle "tornar perfil público".

## Rollout em fases

1. **Migração 1** — enums, tabelas de conteúdo (trails/courses/modules/lessons), profiles, trail_memberships, GRANTs, RLS, trigger de profile auto-criado.
2. **Migração 2** — enrollments, lesson_progress, certificates, payments (schema completo, sem integração), triggers de progresso agregado.
3. **Frontend** — painel admin de ensino + liberação manual + área do aluno básica (listagem, player, progresso).
4. **Futuro (não agora)** — edge functions Stripe/MP, checkout, webhook → enrollment automático.

## Perguntas rápidas antes de migrar

1. **Instrutores** vão publicar conteúdo próprio (precisam UI de edição) ou só o admin cria tudo no começo?
2. **Certificados** — quer que eu já gere PDF (via edge function) ou só o registro no banco por enquanto?
3. **Player de vídeo** — Vimeo/YouTube (link) ou upload direto no storage do Cloud?
