# Contrato de sincronização do JARVIS

## Fluxo

```
Obsidian privado
  → exportação de 99_PUBLISH/
  → branch agent/<agente>/<id>
  → PR + CI + PII/secret scan
  → ingest_staging
  → validação e promoção
  → Supabase
  → /admin
```

O admin pode gerar snapshots derivados de volta ao vault por PR. Nunca reescrever automaticamente uma nota humana.

## Frontmatter mínimo

```yaml
id: uuid-estavel
kind: project|agent|course|lesson|content|site|task|evidence
title: Título
status: active
visibility: private|internal|public
owner_id: uuid
revision: 1
updated_at: 2026-07-10T12:00:00Z
sync_mode: publish|snapshot|manual
source_path: 99_PUBLISH/projects/exemplo.md
checksum: sha256
schema_version: 1
external_refs: []
```

## Idempotência e conflitos

- upsert por `(id, revision)`;
- revisão menor ou igual não sobrescreve;
- checksum idêntico é no-op;
- divergência cria conflito explícito;
- nunca usar last-write-wins silencioso;
- promoção para tabela de domínio ocorre somente depois da validação.

## Modelo mínimo

- `resources`
- `resource_versions` imutável
- `external_refs`
- `ingest_staging`
- `sync_runs`
- `sync_conflicts`

As tabelas existentes de cursos, matrículas e certificados continuam canônicas em seus domínios.
