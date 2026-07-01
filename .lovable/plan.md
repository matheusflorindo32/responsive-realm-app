## Objetivo

Restaurar a **Tropa Científica** como marca principal na raiz (`/`) e mover todo o trabalho APOS já feito para uma área institucional separada em `/matheus/*`, sem apagar nada.

## Arquitetura de rotas

```text
/                      → Tropa Científica — Home (marca, conteúdo, ciência+IA+segurança pública)
/sobre-a-tropa         → Manifesto/sobre o projeto Tropa Científica
/conteudos             → Vídeos, posts, materiais educativos (placeholder inicial)
/projetos-tropa        → Projetos internos da Tropa (placeholder inicial)
/matheus               → Site institucional acadêmico (Home APOS — atual `/`)
/matheus/sobre         → atual /sobre
/matheus/publicacoes   → atual /publicacoes
/matheus/formacao      → atual /formacao
/matheus/projetos      → atual /projetos (inclui card destacado "Tropa Científica" linkando para /)
/matheus/experiencia   → atual /experiencia
/matheus/contato       → atual /contato
```

Navegação cruzada obrigatória:
- Navbar da Tropa Científica: link "Sobre o fundador" → `/matheus`
- Navbar do APOS: link "← Tropa Científica" → `/`

## Design tokens separados por contexto

Adicionar duas famílias de tokens no `src/index.css` (via classes de escopo `.theme-tropa` e `.theme-apos` aplicadas no `<Layout>` de cada área), preservando os tokens APOS já existentes:

- **Tropa Científica** (raiz): dark futurista, cyan/electric blue neon, glassmorphism, Orbitron + Inter — respeitando a memória do projeto.
- **Matheus/APOS** (`/matheus/*`): navy `#0B1F3A`, gold `#B7791F`, verde científico `#0F766E`, Fraunces + Inter + JetBrains Mono — já implementado, apenas isolado por escopo.

## Trabalho a fazer

### 1. Reorganizar APOS (não apagar)
- Mover `src/pages/Home|About|Publications|EducationPage|Projects|ExperiencePage|Contact.tsx` para `src/pages/matheus/`.
- Manter `src/components/apos/*` como está.
- Ajustar todos os links internos do APOS para prefixo `/matheus`.
- No `src/components/apos/Navbar.tsx`, adicionar botão "← Tropa Científica" apontando para `/`.
- No card de projeto "Tropa Científica" dentro de `/matheus/projetos`, apontar demo para `/`.

### 2. Recriar Tropa Científica
- Novos componentes em `src/components/tropa/`:
  - `Navbar.tsx` (marca Tropa + links: Conteúdos, Projetos, Sobre a Tropa, "Sobre o fundador →/matheus")
  - `Footer.tsx`
  - `Layout.tsx` (wrapper com classe `theme-tropa`)
  - `HeroSection.tsx` (Tropa Científica — ciência, IA e segurança pública)
  - `MissionSection.tsx` (manifesto curto)
  - `ContentPillars.tsx` (3–4 pilares: Ciência, IA, Segurança Pública, Educação)
  - `FeaturedContent.tsx` (grid placeholder para vídeos/posts, com estado vazio elegante)
  - `FounderCTA.tsx` (bloco destacando Matheus Florindo com CTA → `/matheus`)
- Novas páginas em `src/pages/tropa/`: `Home.tsx`, `Sobre.tsx`, `Conteudos.tsx`, `Projetos.tsx`.
- Restaurar estética Orbitron + neon cyan conforme memória do projeto, sem reintroduzir componentes deletados 1:1 — versão nova, coerente com o design atual do restante.

### 3. Fonte de dados compartilhada
- `src/data/apos-master.json` continua sendo a fonte única.
- Criar `src/data/tropa-content.json` (placeholder) para pilares/conteúdos da Tropa Científica.
- Adapter atual (`localMockAdapter`) permanece; adicionar leitura leve de `tropa-content.json`.

### 4. Roteamento e SEO
- Atualizar `src/App.tsx`: dois grupos de rotas com Layouts distintos (`TropaLayout` na raiz, `AposLayout` em `/matheus`).
- SEOHead por rota: título/description específicos por contexto; JSON-LD `Organization` (Tropa) na raiz e `Person` (Matheus) em `/matheus`.
- Atualizar `index.html` `<title>` e `<meta description>` para a marca Tropa Científica (institucional passa a ser página interna).

### 5. Compatibilidade / redirects
- Adicionar rotas de compatibilidade que redirecionam antigas URLs APOS da raiz para `/matheus/*` (`/sobre` → `/matheus/sobre`, `/publicacoes` → `/matheus/publicacoes`, etc.) para não quebrar links já compartilhados.

## Detalhes técnicos

- Sem novas dependências. Usa React Router, Helmet, Tailwind e tokens já instalados.
- Tokens escopados por classe no `<Layout>` para evitar vazamento de cores entre as duas áreas.
- Nenhum arquivo será deletado; APOS é movido, não removido. Componentes antigos da Tropa são reescritos (não restaurados do histórico) para casar com o padrão de código atual.

## Fora de escopo (fase 2)

- CMS real para posts/vídeos da Tropa.
- Integração com YouTube/RSS.
- Toggle PT/EN.
- Backend do formulário de contato.
