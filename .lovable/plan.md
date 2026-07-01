## Objetivo

Substituir a home atual da Tropa Científica (`/`, tema dark neon) por uma landing page **premium light**, com todas as seções pedidas, parallax de scroll no emblema 3D, microinterações Framer Motion e visual de laboratório de inovação. Escopo: apenas rota `/` da Tropa. `/matheus/*` (APOS) segue intocado.

## Direção visual

- **Paleta light**, escopada em `.theme-tropa` (sobrescreve os tokens dark atuais):
  - `background` `#FAFBFC`, `card` `#FFFFFF`, `muted` `#F1F5F9`, `border` `#E2E8F0`.
  - `foreground` `#0B1220`, `muted-foreground` `#475569`.
  - `primary` azul científico `#2563EB`, `primary-glow` `#60A5FA`, `accent` prata `#94A3B8`.
  - Tokens de gradient/shadow novos em `index.css`: `--gradient-hero` (radial azul→prata→branco), `--shadow-elevated` (sombra suave em duas camadas), `--shadow-glass`.
- **Tipografia**:
  - Manter `Orbitron` **apenas** no wordmark "TROPA CIENTÍFICA" e em eyebrows/mono labels.
  - Trocar headings principais para `Space Grotesk` (institucional + tech) e corpo em `Inter`. Instalar via `@fontsource/space-grotesk`.
- **Surface treatment**: glassmorphism leve (`bg-white/70 backdrop-blur-xl` + `border border-border/60` + `shadow-elevated`). Grid pattern muito sutil no hero e CTA final via SVG inline. Hairlines em vez de bordas grossas.
- **Referências 21st.dev** (extrair linguagem, não copiar código): shadway/*sleek-hero-with-orb*, shadway/*hero-section-with-smooth-bg-shader*, kokonutui bento features, magicui/aceternity feature grids, motion-primitives scroll reveals.

## Estrutura de rotas e arquivos

Rota `/` renderiza um novo `TropaHome` composto por seções pequenas.

```
src/components/tropa/
  Navbar.tsx                (reescrito — light glass, sticky com backdrop-blur)
  Footer.tsx                (reescrito — light, colunas + social)
  Layout.tsx                (mantém .theme-tropa)
  TropaLogo3D.tsx           (adaptado ao tema light + parallax por scroll)
  sections/
    Hero.tsx
    WhatIs.tsx              ("O que é a Tropa Científica")
    Areas.tsx               ("Áreas de atuação" — bento 8 cards)
    Contents.tsx            ("Conteúdos" — grid formatos)
    WhyFollow.tsx           ("Por que acompanhar" — feature grid)
    TechStack.tsx           ("Tecnologias e temas" — badges animadas)
    Authority.tsx           ("Autoridade" — split com foto placeholder + texto)
    FinalCTA.tsx            ("Ciência não precisa ficar distante da prática")

src/pages/tropa/Home.tsx    (compõe as seções acima + Helmet SEO)
src/data/tropa-content.ts   (arrays estáticos: áreas, conteúdos, tecs, benefícios)
```

## Hero e efeito 3D com scroll

- Layout split: coluna esquerda com eyebrow ("Divulgação Científica · 2026"), H1 grande em Space Grotesk, subtítulo, 3 CTAs (`Conhecer a Tropa Científica` primary, `Ver Conteúdos` outline, `Entrar em Contato` ghost).
- Coluna direita: `TropaLogo3D` adaptado ao fundo claro (globo de pontos em azul `#2563EB` com opacidade menor, logo billboardada, halo suave em vez de neon).
- **Parallax de scroll**:
  - Container do 3D usa `useScroll` + `useTransform` (framer-motion) para aplicar `y`, `rotate` e `scale` sutis ao wrapper `motion.div` conforme `scrollYProgress` do hero — sem tocar no loop do Canvas.
  - Fallback: em `matchMedia('(max-width: 768px)')` ou `prefers-reduced-motion`, renderizar imagem estática PNG do emblema (`src/assets/tropa-icon.png` já existente) sem Canvas.
- Grid pattern radial no fundo do hero via SVG + máscara radial.

## Sections — detalhamento

1. **WhatIs**: 2 colunas (texto institucional + card destaque com 3 métricas "áreas · formatos · alcance").
2. **Areas**: bento assimétrico de 8 cards (IA, Ciência de Dados, Segurança Pública, Drones, Educação, Pesquisa Aplicada, Dev Web, Automação). Cada card: ícone Lucide, título, 1 linha, hover-lift + gradient hairline no topo.
3. **Contents**: grid 3×3 de formatos (Vídeos, Infográficos, Análises, Artigos, Projetos, Estudos, YouTube, Instagram, LinkedIn) — cards mais compactos.
4. **WhyFollow**: 6 benefícios em grid 3×2 com ícones e microcopy.
5. **TechStack**: linha de badges animadas (fade-in em sequência via `staggerChildren`).
6. **Authority**: split 5/7. Esquerda: mock de retrato/emblema. Direita: texto sugerido + link "Sobre o fundador → /matheus".
7. **FinalCTA**: card full-width com gradient sutil, 2 botões, âncora "Falar com a Tropa Científica" → `/contato` (rota nova redireciona para email `mailto:` por enquanto).

## Motion & microinterações

- `framer-motion` já está instalada (verificar em `package.json`); se não, `bun add framer-motion`.
- Padrões reutilizados:
  - `motion.div` com `whileInView={{ opacity: 1, y: 0 }}` + `viewport={{ once: true, margin: "-80px" }}` para revelar seções.
  - `staggerChildren` em containers de grid (Areas, Contents, TechStack).
  - Botões shadcn com nova variant `variant="hero"` (adicionar em `button.tsx`) — gradient azul + shadow-elevated + hover translate-y sutil.
  - Hover lift `-translate-y-1 shadow-elevated` nos cards, com transição `duration-300`.

## Performance & acessibilidade

- Lazy-load do Canvas 3D com `React.lazy` + `Suspense` (fallback = imagem estática).
- `prefers-reduced-motion` reduz o parallax do hero e desativa float do logo.
- Imagens com `loading="lazy"` e dimensões explícitas.
- Semântica: `<header>`, `<main>`, `<section aria-labelledby>`, `<footer>`. H1 único no hero, H2 por seção.
- Contraste AA em todos os textos sobre light.
- Meta title/description dedicados em `<Helmet>`; JSON-LD `Organization` no Hero.

## Navbar e Footer

- **Navbar** light: fundo `bg-white/80 backdrop-blur-xl`, hairline inferior, wordmark Orbitron em `text-foreground`, links `Início / Áreas / Conteúdos / Manifesto / Sobre o fundador →`. Sticky top-0, encolhe ao rolar (altura via `useScroll`).
- **Footer** light: 4 colunas — marca + descrição, Links, Conteúdos, Contato. Ícones sociais (YouTube, Instagram, LinkedIn, GitHub) em Lucide. Linha inferior `© 2026 Tropa Científica`.

## Detalhes técnicos

- Todos os tokens novos vivem em `src/index.css` dentro de `.theme-tropa { ... }` — não vazam para `/matheus`.
- Nenhuma cor hardcoded nos componentes; sempre via classes semânticas (`bg-card`, `text-primary`, etc.). Novo `button` variant `hero` é definido em `src/components/ui/button.tsx` com `cva`.
- Rotas atuais mantidas: `/`, `/sobre-a-tropa`, `/conteudos`, `/projetos-tropa` continuam funcionando; apenas `/` recebe a nova composição. As outras 3 páginas herdam a nova paleta light automaticamente (nada quebra visualmente porque hoje são placeholders finos).
- APOS `/matheus/*` permanece 100% intacto (tokens escopados via `.theme-apos` no `AposLayout`).
- Dependências novas: `@fontsource/space-grotesk` (import em `src/main.tsx`, fontFamily em `tailwind.config.ts`). Framer Motion apenas se ainda não presente.

## Fora de escopo (fase 2)

- CMS/YouTube API para conteúdos reais (usa dados estáticos agora).
- Formulário de contato funcional (por ora `mailto:` ou link para `/matheus/contato`).
- i18n PT/EN.
- Refazer as páginas `/sobre-a-tropa`, `/conteudos`, `/projetos-tropa` — herdam a nova paleta, mas conteúdo aprofundado fica para outra rodada.
