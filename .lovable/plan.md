## Situação atual

A página pública de validação **já existe** e está funcional:

- Rota: `/certificado/:code` (registrada em `src/App.tsx`)
- Arquivo: `src/pages/CertificadoPublico.tsx`
- Consome `supabase.rpc("verify_certificate", { _code })` — SECURITY DEFINER, público
- Já mostra: QR Code (`qrcode.react`), status válido/revogado, nome do aluno, curso, carga horária, data de emissão, código único, botões imprimir/copiar link, `Helmet` com SEO

## Lacunas a corrigir

1. **Trilha não é exibida** — o RPC já retorna `trail_name`, mas o componente ignora o campo.
2. **Estado "revogado" é fraco** — quando `status='revoked'`, o diploma continua renderizando idêntico ao válido, apenas com um ícone pequeno no topo. Não mostra `revoked_at` nem faixa visual de invalidação.
3. **Emissor (`issuer`) não é exibido** — vem do RPC mas está hardcoded como "Tropa Científica" no cabeçalho.

## Plano de mudança (incremental, só front-end)

Editar apenas `src/pages/CertificadoPublico.tsx`:

1. **Exibir trilha** quando `c.trail_name` existir: linha "Trilha: <nome>" abaixo do título do curso, com ícone `Route` do lucide.
2. **Usar `c.issuer`** (fallback "Tropa Científica") no cabeçalho do diploma.
3. **Estado revogado destacado**:
   - Faixa diagonal "REVOGADO" sobre o card (via CSS, `print:hidden` = false para sair no PDF).
   - Banner vermelho no topo com `revoked_at` formatado.
   - Borda do diploma muda para `border-destructive/60` quando revogado.
   - Alt do QR Code passa a linkar mesmo assim (validação continua útil para provar revogação).
4. **Meta description** ganha sufixo "— REVOGADO" quando aplicável.
5. **Acessibilidade**: `aria-live="polite"` no status, `role="status"`.

Nada muda em rotas, banco, RLS ou RPC. Nenhum arquivo novo.

## Arquivos afetados

- `src/pages/CertificadoPublico.tsx` (edição única)

Usei o skill 21st-dev-design-finder para manter a estética diploma premium (glow amber, glass, hairline) já estabelecida.