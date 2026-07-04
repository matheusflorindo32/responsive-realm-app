
# Plataforma de Autenticação Premium — Tropa Científica

Consolidar toda a autenticação em uma experiência única, visualmente premium e segura, sem alterar RLS, papéis ou lógica de negócio existente.

## 1. Arquitetura de rotas

Rotas públicas novas / renomeadas:

```text
/login              → login único (aluno + admin)
/cadastro           → criar conta (aluno)
/forgot-password    → solicitar reset
/reset-password     → definir nova senha (via link do email)
/mfa/setup          → configurar TOTP (após login admin sem MFA)
/mfa/verify         → validar código TOTP (admins)
/auth/callback      → landing pós-OAuth (decide destino por papel)
```

Compatibilidade e redirects:

- `/entrar` → `Navigate replace` para `/login`
- `/admin` (GET não autenticado) → `Navigate` para `/login?next=/admin`
- Preservar `?next=` em todos os fluxos (login, cadastro, Google OAuth via state em `localStorage` sanitizado como path same-origin).

Roteamento pós-login (feito em `/auth/callback` e no submit dos formulários):

```text
sessão válida
 ├─ tem papel admin  → se MFA não verificado nesta sessão → /mfa/verify → /admin
 │                     senão → /admin
 └─ caso contrário   → /app  (ou ?next=)
```

## 2. Navbar reativa (Tropa pública)

Editar `src/components/tropa/Navbar.tsx` para consumir o estado de auth via um novo hook `useAuthSession` (listener `onAuthStateChange` + `getUser`), exibindo:

- Deslogado: botão CTA **Entrar** (link `/login`)
- Aluno logado: botão **Minha Área** (link `/app`)
- Admin logado: botão **Painel Admin** (link `/admin`)

Admin nunca aparece como item de menu público — apenas via CTA condicional após login.

## 3. Design system das telas de auth

Layout compartilhado `AuthShell` (novo, `src/components/auth/AuthShell.tsx`) split-screen responsivo:

- **Esquerda (≥lg):** painel de marca — logo Tropa Científica, headline curta ("Acesso seguro à sua jornada científica"), 3 trust badges (Ambiente seguro / Certificados digitais / Acesso protegido), gradiente dark sutil + grade geométrica discreta, sem partículas pesadas.
- **Direita:** card glassmorphism (`backdrop-blur`, borda cyan 1px com glow suave), largura máx 420px, Orbitron nos títulos, Inter no corpo, botão primário cyan neon controlado, botão Google secundário outline.
- Mobile: painel de marca colapsa em header compacto acima do card.
- Estados: loading (spinner + botão disabled), erro (alert vermelho acessível), sucesso (toast + transição), skeletons quando aplicável.
- Todas as cores via tokens semânticos em `index.css` (sem hex hardcoded nos componentes).

Aplicar o mesmo `AuthShell` a: `/login`, `/cadastro`, `/forgot-password`, `/reset-password`, `/mfa/setup`, `/mfa/verify`.

## 4. Segurança nível elite

- **Reset de senha:** `supabase.auth.resetPasswordForEmail(email, { redirectTo: origin + '/reset-password' })`. Página `/reset-password` detecta `type=recovery` no hash e chama `updateUser({ password })`. Mensagem genérica em `/forgot-password` ("Se existir uma conta com este email, enviaremos um link") para não vazar existência.
- **HIBP (senhas vazadas):** ativar `password_hibp_enabled: true` via `supabase--configure_auth`.
- **Validação forte no cliente:** Zod schema — mín 12 chars, maiúscula, minúscula, número, símbolo. Checklist visual em tempo real no cadastro e reset.
- **MFA/TOTP para admins:**
  - Após login, se `user_roles` contém `admin` e `factors` não tem TOTP verificado → força `/mfa/setup`.
  - Se já tem factor mas sessão atual sem AAL2 → `/mfa/verify` antes de liberar `/admin/*`.
  - Componente `AdminLayout` (já existe) recebe guard adicional que checa `supabase.auth.mfa.getAuthenticatorAssuranceLevel()` ≥ `aal2`.
  - Telas usam `supabase.auth.mfa.enroll/challenge/verify` (nativo). QR renderizado via biblioteca leve (`qrcode` já usado no projeto se disponível; senão fetch de data URL).
- **Rate limiting client-side simples:** contador local por email (5 tentativas em 5min) exibindo cooldown — não substitui proteções do provider, mas melhora UX e freia scripts triviais. Documentar no chat que rate-limit real fica no Supabase.
- **Google OAuth:** manter `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth/callback" })` em todas as telas.
- **Não alterar** RLS, `user_roles`, `has_role`, triggers ou edge functions existentes.

## 5. Ajustes técnicos

Arquivos criados:

- `src/components/auth/AuthShell.tsx`
- `src/components/auth/PasswordStrength.tsx`
- `src/hooks/useAuthSession.ts` (session + role reativo, `onAuthStateChange`)
- `src/lib/auth/redirects.ts` (sanitiza `next`, resolve destino por papel)
- `src/lib/auth/schemas.ts` (Zod: login, signup, reset)
- `src/pages/auth/Login.tsx`
- `src/pages/auth/Cadastro.tsx`
- `src/pages/auth/ForgotPassword.tsx`
- `src/pages/auth/ResetPassword.tsx`
- `src/pages/auth/MfaSetup.tsx`
- `src/pages/auth/MfaVerify.tsx`
- `src/pages/auth/AuthCallback.tsx`

Arquivos editados:

- `src/App.tsx` — novas rotas + redirect `/entrar` → `/login`
- `src/components/tropa/Navbar.tsx` — CTA reativo
- `src/components/admin/AdminLayout.tsx` — guard AAL2 para admins
- `src/hooks/useAdminGuard.ts` — usar `useAuthSession` e checar MFA
- `src/pages/app/Entrar.tsx` — remover ou redirecionar (mantido só como redirect)
- `src/pages/admin/AdminAuth.tsx` — redirecionar para `/login?next=/admin` (mantém compat)
- `src/index.css` — tokens de glow/glass já existentes reutilizados; adicionar variáveis se faltar

Configuração backend (sem tocar schema):

- `supabase--configure_auth` → `password_hibp_enabled: true`, `disable_signup: false`, `auto_confirm_email: false`, `external_anonymous_users_enabled: false`.

## 6. Fora de escopo (confirmado)

- Sem mudanças em RLS, tabelas, triggers, matrículas, progresso, certificados.
- Sem novos provedores OAuth além do Google já ativo.
- Sem captcha externo nesta iteração (pode ser adicionado depois se necessário).
- MFA apenas para admins (alunos podem ganhar em fase futura).

Ao aprovar, implemento tudo em sequência: migração de config de auth → shell + hooks → páginas → integração no navbar/guards → verificação visual das telas.
