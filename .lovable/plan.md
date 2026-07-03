# Plano — Certificado público (demo + exemplo real verificável)

## Objetivo
Permitir que qualquer pessoa visualize o diploma premium da Tropa Científica em duas frentes:
1. Uma rota pública **puramente demonstrativa** (`/certificado/demo`) sem tocar no banco.
2. Um certificado **real e verificável** com código fixo `TROPA-ELITE-2026`, validado pelo mesmo RPC de produção.

Manter intactas todas as rotas de erro premium já existentes (formato inválido / não encontrado / revogado / falha de RPC).

---

## 1. Arquitetura de rotas

```text
/certificado/demo              → renderiza o diploma com dados mock (sem fetch)
/certificado/TROPA-ELITE-2026  → passa pelo verify_certificate normal (válido)
/certificado/:code             → fluxo real já existente
```

A detecção de "demo" acontece **antes** do regex e do `useQuery`: se `code === "demo"`, pulamos validação e RPC e renderizamos direto o `<CertificadoDiploma />` com props fictícias e uma faixa discreta "Certificado demonstrativo — modelo público da Tropa Científica."

## 2. Refatoração de `CertificadoPublico.tsx`

Hoje o arquivo mistura fetch + layout + estados de erro. Vou extrair o corpo visual do diploma em um componente reutilizável para que demo e real compartilhem 100% do visual:

- `src/components/certificado/CertificadoDiploma.tsx` — recebe props tipadas (`studentName`, `courseTitle`, `trailName`, `issuer`, `hours`, `issuedAt`, `status`, `revokedAt`, `code`, `verifyUrl`, `isDemo?`) e desenha:
  - Backdrop grid + radial glow (mesmo tratamento premium)
  - Cabeçalho editorial "Tropa Científica · Certificado"
  - Bloco principal com serifa display para o nome do aluno
  - Metadados em `dl` com mono/tabular-nums
  - Selo de autenticidade + status pill (válido / revogado / demonstrativo)
  - QR Code (`QRCodeSVG`) apontando para `verifyUrl`, texto "Escaneie para validar"
  - Ações: **Copiar código**, **Voltar ao início**, **Imprimir / Salvar PDF** (`window.print()`)
  - Se `isDemo`, badge discreta no topo e watermark sutil "MODELO DEMONSTRATIVO"
  - `@media print` limpo (esconde header/actions, mantém diploma A4 paisagem)
- `src/pages/CertificadoPublico.tsx` passa a orquestrar apenas: parse do `code` → branch demo | branch real → estados de erro premium (mantidos como estão).

## 3. Ajuste do regex de formato

Atual: `/^[A-Za-z0-9-]{6,64}$/`
Novo: `/^[A-Z0-9-]{6,40}$/` aplicado sobre `code.toUpperCase()` para permitir `TROPA-ELITE-2026` e demais códigos institucionais mantendo defesa contra entrada maliciosa.

O caminho `demo` é reconhecido antes do regex (case-insensitive) e não passa por validação.

## 4. QR Code contextual

- Demo → `${origin}/certificado/demo`
- Real → `${origin}/certificado/${code}`
- Erro (não encontrado / inválido) → **sem QR** (mantido como está)

## 5. Semear certificado real de exemplo

Migração para garantir um usuário-modelo (não usa `auth.users`, apenas `profiles` como snapshot) e inserir o certificado fixo:

```sql
-- perfil sintético apenas para snapshot (user_id fixo, sem auth)
INSERT INTO public.certificates (
  user_id, certificate_code, student_name, course_title,
  trail_name, hours, issuer, status, issued_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'TROPA-ELITE-2026',
  'Modelo Elite Tropa Científica',
  'Certificado Demonstrativo Premium Elite',
  'Tropa Científica — Formação Modelo',
  40,
  'Tropa Científica',
  'valid',
  '2026-07-03 12:00:00-03'
) ON CONFLICT (certificate_code) DO NOTHING;
```

Observações:
- `certificate_code` já tem UNIQUE (verifico no migration; se não tiver, adiciono).
- `user_id` é NOT NULL mas sem FK para `auth.users` (confirmado pelo schema atual — coluna `uuid NOT NULL` sem referência), então o UUID sintético é aceito.
- Nenhum dado pessoal, CPF ou e-mail é inserido.
- O trigger `snapshot_certificate_data` respeita valores já preenchidos (usa `COALESCE`), então os dados fictícios são mantidos.
- O certificado aparece automaticamente no admin (`/admin/ensino/certificados`) porque a listagem lê a mesma tabela.

## 6. Critérios de aceite

- [ ] `/certificado/demo` abre o diploma premium sem chamar o backend e sem erro.
- [ ] `/certificado/TROPA-ELITE-2026` retorna válido via `verify_certificate` RPC.
- [ ] QR da demo aponta para `/certificado/demo`; QR do real aponta para `/certificado/TROPA-ELITE-2026`.
- [ ] Códigos inválidos (`/certificado/abc`, caracteres proibidos) → tela premium `MALFORMED`.
- [ ] Códigos válidos mas inexistentes → tela premium `NOT_FOUND`.
- [ ] Certificado revogado continua exibindo o estado revogado.
- [ ] Botões: copiar código (toast), voltar ao início, imprimir.
- [ ] Certificado-exemplo visível em `/admin/ensino/certificados`.
- [ ] Responsivo (mobile 375px → desktop 1440px) e `@media print` limpo.
- [ ] `tsgo` compila limpo. Nenhuma rota existente afetada.

---

## Detalhes técnicos

**Arquivos criados**
- `src/components/certificado/CertificadoDiploma.tsx`
- `src/lib/certificado-demo.ts` (constante com os dados fictícios do Matheus/demo)
- `supabase/migrations/<timestamp>_seed_certificate_elite.sql`

**Arquivos editados**
- `src/pages/CertificadoPublico.tsx` — extrai diploma, adiciona branch `demo`, ajusta regex, mantém estados de erro.

**Design tokens**
- Reuso do sistema semântico do projeto (`bg-background`, `border-border`, `text-foreground`, `primary`, etc.) — sem hex hardcoded.
- Tipografia: Orbitron (display do nome do curso/aluno) + Inter (metadados). Coerente com a memory Core.
- Motion via `framer-motion` já instalado (entrada suave do diploma, hover no selo).

**Inspiração (21st.dev)**
Padrões editoriais de "certificate / award / credential" — layout central com hairline borders, corner ticks, selo com glow radial, metadados em mono/small-caps, QR integrado à margem direita. Referências: kokonutui (cards com corner marks), aceternity (gradient border + glow), motion-primitives (entrada em fade+rise).
