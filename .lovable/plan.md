
# Upgrade Premium — Área de Ensino Tropa Científica

Mantém toda a arquitetura atual (trails → courses → modules → lessons, enrollments, progress, certificates, payments). Nada será quebrado — só adição de colunas, novas tabelas auxiliares e refinamento de UI/RLS.

## 1. Banco de dados (Migração única, aditiva)

### 1.1 Enriquecer `courses`
Colunas opcionais novas:
- `trailer_url` text
- `requirements` text[] (lista)
- `target_audience` text[]
- `learning_objectives` text[]
- `materials` jsonb (links/anexos complementares)
- `instructor_name` text (fallback quando não há user)
- (já existem: `level`, `duration_min`, `cover_url`, `status` draft/published — adicionar `archived` ao enum)

### 1.2 Certificados públicos
Alterar `certificates`:
- garantir `certificate_code` unique NOT NULL com default `encode(gen_random_bytes(9),'hex')`
- `hours` int (carga horária snapshot)
- `student_name` text (snapshot do nome no momento da emissão)
- `course_title` text (snapshot)
- `status` enum `valid|revoked` default `valid`
- `revoked_at`, `revoked_reason`

Nova função pública **SECURITY DEFINER** `public.verify_certificate(code text)` que retorna JSON com dados de exibição (sem expor tabela). RLS mantém tabela fechada; validação pública passa só pela função.

### 1.3 Auditoria administrativa
Nova tabela `admin_audit_log`:
- `actor_id` (FK auth.users)
- `action` text (`enrollment.granted`, `enrollment.revoked`, `enrollment.expiration_changed`, `course.created`, `course.updated`, `course.deleted`, `trail.*`, `lesson.*`)
- `entity_type` text, `entity_id` uuid
- `target_user_id` (para ações sobre alunos)
- `metadata` jsonb (diff/detalhes)
- `created_at`

Triggers em `enrollments`, `courses`, `trails`, `lessons` que gravam auditoria automaticamente quando o autor for admin.

RLS: só admin lê. `service_role` full.

### 1.4 Pagamentos idempotentes (Stripe + Mercado Pago)
Alterar `payments`:
- garantir `provider` enum já cobre `stripe|mercadopago|manual`
- `provider_payment_id` text (id do PaymentIntent/preference)
- `provider_event_id` text UNIQUE (id do webhook — chave de idempotência)
- `raw_payload` jsonb
- `processed_at` timestamptz
- `status` enum `pending|paid|failed|refunded|chargeback`
- Índice único parcial em `(provider, provider_event_id)` para bloquear reprocessamento

Função `public.grant_enrollment_from_payment(payment_id uuid)` SECURITY DEFINER — cria enrollment se ainda não existir para (user, course/trail) com `access_type='purchase'`. Idempotente. Chamada pelo webhook futuro.

### 1.5 Revisão de RLS
Auditar e reafirmar em uma passada:
- `enrollments`: aluno SELECT próprio; instrutor SELECT por trilha via `private.has_trail_role`; admin ALL.
- `lesson_progress`: aluno ALL próprio; instrutor SELECT por trilha; admin SELECT.
- `certificates`: dono SELECT próprio; admin ALL. **Validação pública SOMENTE via função** `verify_certificate`.
- `courses/modules/lessons`: SELECT público apenas para linhas com `status='published'` e apenas metadados; conteúdo real (`video_url`, `content_md`, `attachments`) liberado por policy condicional exigindo enrollment ativo OR `is_preview` OR admin/instrutor.
- `payments`: dono SELECT próprio; admin ALL. Sem INSERT do client.
- `admin_audit_log`: admin SELECT; sem INSERT/UPDATE/DELETE do client (só triggers/service_role).
- `REVOKE EXECUTE ... FROM public, anon` em toda função SECURITY DEFINER interna; `GRANT EXECUTE` apenas ao papel certo (`authenticated` para `verify_certificate`).

## 2. Frontend — Dashboard do aluno premium (`/app`)

Redesign inspirado em padrões de LMS premium (Maven, Podia, MagicUI/Aceternity — bento + cards com progresso, hairlines finas, glow sutil no accent).

Componentes novos em `src/components/app/`:
- **`ContinueWatching.tsx`** — bloco de destaque no topo: última aula com progresso >0 e <100%. Botão "Continuar aula" grande, thumbnail, curso, aula, barra de progresso.
- **`AccessStatusBadge.tsx`** — badge derivada de `expires_at`: `Ativo`, `Expirando em N dias` (<15d), `Expirado`.
- **`CourseCard.tsx`** — card premium com cover, trilha (eyebrow), título, progresso circular + linear, badge de status, CTA "Continuar".
- **`TrailCard.tsx`** — variante para trilhas completas (destaque com borda accent).
- **`CertificateHighlight.tsx`** — carousel/faixa com últimos certificados emitidos, link para página pública.
- **`DashboardStats.tsx`** — mini bento: cursos ativos, aulas concluídas, certificados, horas estudadas (soma de `watch_time_sec`).

Layout `/app`:
```
┌─ Header saudação + stats bento (4 cards) ─┐
├─ Continue de onde parou (destaque) ───────┤
├─ Meus cursos (grid CourseCard) ───────────┤
├─ Minhas trilhas ───────────────────────────┤
└─ Certificados recentes ───────────────────┘
```
Responsivo (1/2/3 colunas), Framer Motion em entrada, hover lift.

## 3. Certificados premium

### 3.1 Página pública `/certificado/:code`
Rota pública (sem auth). Consome `verify_certificate(code)`.
- Layout tipo diploma: nome do aluno, curso, carga horária, data, código, status (Válido/Revogado).
- QR Code (biblioteca `qrcode.react`) apontando para a própria URL — pronto para impressão.
- Botão "Baixar PDF" (placeholder — futuro edge function `render-certificate`).
- SEO: `<title>` e og com nome+curso.

### 3.2 Área do aluno `/app/certificados`
Refinar cards: mostrar carga horária, código, botão "Ver página pública" e "Copiar link de validação".

## 4. Admin — Auditoria e visão detalhada

### 4.1 `/admin/ensino/auditoria` (novo)
- Tabela paginada de `admin_audit_log` com filtros: ator, ação, entidade, aluno-alvo, período.
- Badges coloridos por tipo de ação.
- Drawer com JSON detalhado do `metadata`.

### 4.2 Filtros em `/admin/ensino/matriculas`
Adicionar filtros por: aluno (busca), curso, trilha, status (`pending|active|expired|revoked|refunded`), tipo (`manual|purchase|gift|trial|scholarship`), período.

### 4.3 Visão detalhada de aluno `/admin/ensino/alunos/:userId`
- Perfil resumo.
- Matrículas com status/expiração + ações (revogar, estender).
- Progresso por curso (barra + aulas concluídas/total).
- Certificados emitidos.
- Histórico de auditoria filtrado por esse aluno.

### 4.4 Ações no admin passam a gravar auditoria
Onde já há mutação (criar/editar curso, trilha, lesson, liberar matrícula, revogar, alterar expiração) — chamada extra ao insert em `admin_audit_log` OU coberto por trigger no banco (preferência: trigger, para não depender do client).

## 5. Pagamentos — Preparação (sem integração ativa)

- Schema pronto (item 1.4).
- Doc curto em `.lovable/payments.md` descrevendo o fluxo esperado do webhook futuro:
  1. Webhook recebe evento → verifica assinatura.
  2. Upsert em `payments` usando `(provider, provider_event_id)` como chave.
  3. Se `status='paid'` e ainda não processado, chama `grant_enrollment_from_payment`.
  4. Marca `processed_at`.
- **Nenhuma edge function nova agora** — só a base. Liberação manual continua funcionando exatamente como está.

## 6. Segurança (checklist final)

- Rodar `security--run_security_scan` após a migração.
- Confirmar `REVOKE EXECUTE ... FROM public, anon` em todas security definer internas (`has_trail_role`, `recalc_course_progress`, `grant_enrollment_from_payment`).
- `verify_certificate` é a única exposta a `anon`.
- Todas as novas policies escritas no padrão: `USING (auth.uid() = user_id OR has_role(auth.uid(),'admin'))`.
- Atualizar `security-memory` com o modelo de acesso: aluno vê próprio, instrutor vê por trilha, admin vê tudo, público só valida certificado por código.

## 7. Ordem de execução

1. **Migração** (aditiva, tudo em um único arquivo): novas colunas + `admin_audit_log` + triggers de auditoria + função `verify_certificate` + função `grant_enrollment_from_payment` + endurecer RLS/GRANTs.
2. **Componentes de dashboard premium** + refactor de `/app` Dashboard.
3. **Página pública** `/certificado/:code` + refino de `/app/certificados` com QR.
4. **Admin**: auditoria, filtros em matrículas, tela de aluno detalhado.
5. **Scan de segurança** + `update_memory`.

## Detalhes técnicos (referência)

- Bibliotecas novas: `qrcode.react` (client-side QR, ~5KB gz).
- Sem mudança em rotas existentes; adições: `/certificado/:code`, `/admin/ensino/auditoria`, `/admin/ensino/alunos/:userId`.
- Nenhuma quebra em `types.ts` — tudo adição.
- Design tokens: mantidos (dark futuristic, Orbitron/Inter, cyan glow, glassmorphism). CourseCards com hairline `border-white/5`, hover glow `shadow-[0_0_40px_-15px_hsl(var(--primary)/0.5)]`.
- Motion: `framer-motion` stagger nos grids do dashboard.

## Perguntas rápidas (opcional, posso assumir defaults)

1. **QR Code no certificado público** — ok usar `qrcode.react` client-side agora e deixar geração de PDF server-side para depois? (assumo sim)
2. **Auditoria** — quer que ações de instrutor também sejam logadas, ou só admin? (assumo só admin agora)
3. **Cursos arquivados** — devem sumir para o aluno matriculado ou continuar acessíveis? (assumo continuar acessíveis, só somem do catálogo)
