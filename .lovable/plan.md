## Objetivo

Transformar o hero atual da Tropa Científica (imagem estática com float) em uma **pinned hero section** com scrollytelling: a cena fica travada na viewport por ~2.5x a altura da tela, e o progresso do scroll controla a coreografia da logo, do fundo, das partículas e dos cards flutuantes. Escopo: apenas `src/components/tropa/sections/Hero.tsx` (e um par de subcomponentes novos). Nenhuma outra seção da home muda.

## Arquitetura da seção

```
<section ref className="relative h-[320vh]">   ← "trilho" de scroll (3.2x viewport)
  <div className="sticky top-0 h-screen overflow-hidden">   ← palco pinado
    ├── Layer 0: grid SVG (parallax lento, y = -10%..+10%)
    ├── Layer 1: gradient blobs (scale + opacity com scroll)
    ├── Layer 2: partículas canvas 2D (translate y + fade)
    ├── Layer 3: linhas/anéis orbitais SVG (rotate + stroke-dashoffset)
    ├── Layer 4: logo emblema (translateX/Y + scale + rotateY/X + blur pulse)
    ├── Layer 5: cards flutuantes IA/Dados/Segurança/Drones/Pesquisa (fade + translate radial)
    └── Layer 6: bloco de texto (eyebrow → H1 → subtítulo → CTAs, em etapas)
  </div>
</section>
```

Um único `useScroll({ target, offset: ["start start", "end end"] })` alimenta todos os `useTransform`. Timeline por progresso `p ∈ [0,1]`:

- **0.00 – 0.15** — Estado inicial: logo grande à direita, título principal visível, fundo limpo.
- **0.15 – 0.35** — Logo rotaciona `rotateY: 0→18°`, `rotateX: 0→-6°`, `scale: 1→1.08`. Grid ganha profundidade (`y: 0→-40px`, `opacity: 0.4→0.7`). Partículas fazem fade-in.
- **0.35 – 0.55** — Cinco cards flutuantes (IA, Ciência de Dados, Segurança Pública, Drones, Pesquisa Aplicada) entram em stagger radial ao redor da logo (`opacity 0→1`, `translate` do centro para posições distribuídas em elipse).
- **0.55 – 0.80** — Logo desloca `x: 0→-8%` (centraliza), `scale: 1.08→0.92`. Textos secundários (subtítulo curto + 3 métricas) fazem slide-up. Halo pulsa (`opacity 0.35↔0.6` via loop independente).
- **0.80 – 1.00** — Cena estabiliza: cards param, logo volta a `rotateY: 0`, CTAs entram e a seção libera o scroll natural para `WhatIs`.

## Componentes e utilidades novas

1. **`Hero.tsx`** reescrito:
   - Wrapper `section` com altura `h-[320vh]` desktop / `h-[220vh]` tablet / `h-auto` mobile.
   - Palco interno `sticky top-0 h-screen`.
   - `useScroll` no wrapper, `useTransform` para cada layer.
   - `useReducedMotion` → desativa pin (altura vira `min-h-screen`, transforms viram estáticos).

2. **`HeroParticles.tsx`** (novo, lazy):
   - Canvas 2D leve (~80 partículas desktop, 30 mobile) com drift lento.
   - Recebe `progress: MotionValue<number>` e ajusta densidade/opacidade via `useMotionValueEvent`.
   - Sem three.js — mantém performance.

3. **`HeroGrid.tsx`** (novo):
   - Fundo SVG com pattern de grid + máscara radial + linhas diagonais sutis.
   - Recebe `y` e `opacity` como MotionValues.

4. **`HeroOrbits.tsx`** (novo):
   - SVG com 3 anéis elípticos + nodes, animados por `rotate` MotionValue.
   - Substitui a necessidade de Canvas 3D no hero e é 10x mais leve.

5. **`HeroFloatingCards.tsx`** (novo):
   - Array de 5 cards `{ label, icon, angle }` posicionados em coordenadas polares.
   - Cada card recebe `opacity` e `translate` derivados do progresso global com offsets escalonados (`stagger` por index).
   - Glassmorphism: `bg-white/70 backdrop-blur-md border border-border/60 shadow-elevated`.

6. **Logo**: continua sendo `<img src={iconUrl} />` (já validado pelo usuário), mas envolta em `motion.div` com `style={{ x, y, scale, rotateX, rotateY, filter }}`. `transformPerspective: 1200` no wrapper para dar profundidade real ao `rotateY`.

## Detalhes técnicos

- **Framer Motion** já instalado — sem novas deps. GSAP **não** será usado (Framer cobre todo o requisito com menos peso).
- Todos os `useTransform` usam `clamp: true` e curvas suaves (`[0, 0.15, 0.35, 0.55, 0.8, 1]` como keyframes de entrada, com valores correspondentes) — evita saltos.
- `will-change: transform, opacity` nas camadas animadas.
- Cores continuam via tokens `.theme-tropa`: `--primary #2563EB`, `--primary-glow #60A5FA`, fundo `#FAFBFC`. Zero hex hardcoded nos componentes.
- Halo pulsante: `motion.div` com `animate={{ opacity: [0.35, 0.6, 0.35] }}` em loop, **independente** do scroll, para dar vida mesmo parado.
- Cards flutuantes usam ícones Lucide (`Brain`, `Database`, `Shield`, `Plane`, `Microscope`) e labels curtos.

## Mobile & acessibilidade

- **< 768px**: sem pin. Section vira `min-h-screen`, layout single-column, logo estática com float sutil (comportamento atual), cards flutuantes viram grid 2x2 abaixo. Sem canvas de partículas.
- **`prefers-reduced-motion`**: pin desativado, transforms fixos no estado final da etapa 0, cards aparecem por `whileInView` clássico.
- `HeroParticles` importado via `React.lazy` + `Suspense fallback={null}`.
- Semântica preservada: `<section aria-labelledby="hero-title">`, H1 único, textos fora de camadas puramente decorativas.

## Fora de escopo

- Alterações em outras seções (WhatIs, Areas, etc.) — permanecem como estão.
- Reintrodução do Canvas 3D (`TropaLogo3D`) — foi descartado por peso; a sensação de "câmera 3D" vem do `rotateY/rotateX` com perspective + parallax em camadas.
- Rotas fora de `/`.

## Critério de aceitação

Ao rolar a `/`, o usuário vê o hero **travar** por cerca de 2–3 alturas de tela; durante esse trecho a logo gira/escala, o grid e as partículas se movem em velocidades diferentes, os 5 cards temáticos entram em torno da logo em stagger, e só então a página libera para `WhatIs`. Em mobile, a experiência degrada para uma versão estática elegante sem travar o scroll.
