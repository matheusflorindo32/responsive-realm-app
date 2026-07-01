
# Sincronização bidirecional Postgres ↔ Google Sheets

Planilha alvo: `1HzpG3PDDxAPKo6FuTIh-Ms3tcXQJGmwSRD5JI34og20`

## Arquitetura

```text
┌──────────────┐   webhook (<1min)   ┌────────────────────┐
│ Google Sheet │ ──────────────────► │ Edge: sheets-inbound│──┐
│ + AppsScript │                     └────────────────────┘  │
└──────────────┘                                              ▼
       ▲                                              ┌───────────────┐
       │ push (app→sheet)                             │  Postgres     │
       │                                              │ (fonte da     │
┌──────────────┐   invoke              ┌────────────┐ │  verdade)     │
│ Edge: sheets │ ◄──────── App/Botão   │ App (React)│◄┤  + audit log  │
│  -outbound   │                       └────────────┘ └───────────────┘
└──────────────┘                                              ▲
       ▲                                                      │
       │ CRON a cada 10 min (fallback)                        │
┌──────────────┐                                              │
│ Edge: sheets │──────── pull + reconcile ────────────────────┘
│  -sync-cron  │
└──────────────┘
```

Regra: **frontend nunca fala com Sheets**. Toda comunicação passa por Edge Functions com `LOVABLE_API_KEY` + `GOOGLE_SHEETS_API_KEY` no gateway `https://connector-gateway.lovable.dev/google_sheets/v4`.

## Passo 1 — Lovable Cloud + inspeção da planilha
1. Ativar Lovable Cloud (Postgres + Edge Functions + Auth).
2. Ler a planilha via MCP para descobrir abas, colunas e tipos. **Preciso saber quais abas devem entrar no sync** (ver pergunta no final).

## Passo 2 — Schema Postgres

Para cada aba sincronizada, uma tabela espelho + colunas de controle universais:

```sql
-- exemplo genérico (repetido por aba)
create table public.sheet_<aba> (
  id uuid primary key default gen_random_uuid(),
  sheet_row_id text unique not null,          -- chave estável vinda do Sheets (col "id" ou hash)
  sheet_row_number int,                        -- linha física no Sheets (para UPDATE eficiente)
  data jsonb not null,                         -- payload tipado da linha
  updated_at timestamptz not null default now(),
  source text not null check (source in ('app','sheets','system')),
  sync_status text not null default 'synced'
    check (sync_status in ('synced','pending_push','pending_pull','error','conflict')),
  last_synced_at timestamptz,
  conflict_status text,                        -- null | 'app_vs_sheet' | resolvido
  conflict_payload jsonb,                      -- snapshot da versão perdedora
  error_message text
);
create index on public.sheet_<aba>(sync_status);
create index on public.sheet_<aba>(updated_at desc);
```

Tabelas auxiliares:
- `sync_runs` — log de cada execução (id, source, started_at, finished_at, rows_pulled, rows_pushed, errors jsonb, trigger: 'webhook'|'cron'|'manual').
- `sync_conflicts` — fila de conflitos pendentes de revisão manual.
- `user_roles` (padrão Lovable) + role `admin` para gate do painel.

Trigger `updated_at` + trigger que marca `sync_status='pending_push'` quando `source='app'`.

**Grants + RLS** em todas as tabelas (leitura autenticada, escrita restrita conforme papel).

## Passo 3 — Edge Functions

Todas com CORS, validação Zod, `verify_jwt` em código, e uso do connector gateway (nunca SDK direto).

1. **`sheets-inbound`** (público, protegido por HMAC)
   - Recebe webhook do Apps Script: `{ sheet, rowNumber, values, editedAt, secret }`
   - Valida assinatura HMAC (secret compartilhado `SHEETS_WEBHOOK_SECRET`).
   - Faz upsert em `sheet_<aba>` com `source='sheets'`.
   - **Conflito**: se linha já tem `sync_status='pending_push'` E `updated_at > editedAt`, grava em `sync_conflicts` e marca `conflict_status='app_vs_sheet'` em vez de sobrescrever.
   - Registra em `sync_runs`.

2. **`sheets-outbound`** (autenticado)
   - Invocada após mutations do app OU pelo cron para linhas `pending_push`.
   - Lê linhas pendentes, chama `values.update` / `values.append` no gateway.
   - Marca `sync_status='synced'`, `last_synced_at=now()`.
   - Backoff em 429/5xx do Google.

3. **`sheets-sync-cron`** (agendado via `pg_cron` a cada 10 min)
   - Pull: baixa aba completa, compara com Postgres por `sheet_row_id`, aplica diff.
   - Push: dispara `sheets-outbound` para pendências.
   - Reconciliação de segurança caso webhook tenha falhado.

4. **`sheets-sync-now`** (autenticado, role=admin)
   - Endpoint do botão "Sincronizar agora".

## Passo 4 — Apps Script no Google Sheets

Script `onEdit(e)` + gatilho instalável que, ao editar, faz `UrlFetchApp.fetch` para `sheets-inbound` com HMAC.

Fornecerei o snippet pronto (`Code.gs`) para o usuário colar em Extensions → Apps Script da planilha, junto com instruções de criar o trigger instalável (`onChange`, source=SPREADSHEET) e configurar o secret nas Script Properties.

## Passo 5 — App: hooks e mutations

- `useSheetTable(name)` — query React (TanStack) contra Postgres via Supabase client. Sheets nunca é consultado do frontend.
- Todas mutations vão para Postgres com `source='app'`; um listener (trigger DB + Edge) empurra ao Sheets.
- App funciona 100% offline do Sheets — se Google cair, só as pushes ficam `pending_push`.

## Passo 6 — Painel Admin `/admin/sync`

Rota protegida por `has_role(uid,'admin')`. Mostra:
- Cards: última sincronização (por origem), total pendências, total conflitos, erros nas últimas 24h.
- Tabela de `sync_runs` (paginada, filtro por trigger).
- Fila de conflitos com dois lados (app vs sheet) e botões "Manter app" / "Manter sheet" / "Merge manual".
- Botão "Sincronizar agora" (chama `sheets-sync-now`).
- Log de erros com stack trace resumida.

## Passo 7 — Segurança

- `SHEETS_WEBHOOK_SECRET` (gerado via `generate_secret`) — HMAC do webhook.
- `LOVABLE_API_KEY` + `GOOGLE_SHEETS_API_KEY` já disponíveis após conectar Google Sheets como App Connector.
- RLS em todas as tabelas; grants explícitos.
- Rate limit implícito via `sync_runs` (não permitir novo run manual se já roda um).
- Validação Zod em toda entrada de Edge Function.
- Nenhuma chave exposta no frontend (verificado no scan de segurança pós-implementação).

## Passo 8 — Rollout

1. Enable Cloud → conectar Google Sheets connector.
2. Inspecionar planilha, criar migrations.
3. Deploy Edge Functions.
4. Entregar snippet Apps Script + instruções.
5. Backfill inicial (pull completo populando Postgres).
6. Ativar cron.
7. Painel admin.
8. Rodar `security--run_security_scan`.

---

## Precisa confirmar antes de começar

1. **Quais abas** da planilha devem entrar no sync? (todas? só algumas?)
2. Existe uma **coluna `id` estável** em cada aba? Se não, uso hash das colunas-chave — quais colunas identificam unicamente uma linha em cada aba?
3. **Quem é admin** do painel? (você por email? primeiro usuário cadastrado?)
4. Você quer que eu **crie tabelas específicas tipadas** (uma por aba, colunas nomeadas) ou o modelo **genérico com `data jsonb`** acima (mais flexível a mudanças de coluna no Sheets)?
