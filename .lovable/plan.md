## Problema

Os cards flutuantes hoje vivem **dentro do container da logo** (coluna direita, `absolute inset-0` com `left-1/2 top-1/2`). Resultado:
1. Eles aparecem **em cima da logo** durante o scroll.
2. Os `y` offsets (-36% / -18% / 0 / 18% / 36%) do container quadrado geram sobreposição vertical entre eles — ficam ilegíveis.

## Objetivo

Tirar os cards de dentro do emblema e ancorá-los na **lateral esquerda da tela** (fora da área da logo), empilhados verticalmente com **espaçamento fixo em pixels**, entrando em stagger conforme o scroll — sem nunca cruzar a logo.

## Mudanças em `src/components/tropa/sections/Hero.tsx`

### 1. Reposicionar `<FloatingCards />`
- Remover a instância de dentro de `<div className="lg:col-span-5">` (linha ~415).
- Renderizar como **irmão direto** do `container-wide`, dentro do stage `sticky top-0 h-screen`, para que fique ancorado no viewport, não no emblema.
- Wrapper novo: `absolute left-6 xl:left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 z-20 pointer-events-none`.
- Largura fixa dos cards: `w-[240px]` (não passa da coluna de texto porque texto começa depois do padding do `container-wide`; fica na margem lateral esquerda do viewport, ainda dentro do stage).

### 2. Reescrever a lógica de animação de cada card
- Sair de `x/y` percentuais → usar apenas `opacity`, `translateX` em px e `scale`, já que o layout agora é flex vertical (o irmão flex resolve a posição Y — sem sobreposição possível).
- Por card `i` (0..4):
  - `start = 0.30 + i * 0.05`, `end = start + 0.15`
  - `opacity: [start-0.02, end] → [0, 1]`; fade suave em `[0.92, 1] → [1, 0.85]`
  - `x: [start, end] → [-40px, 0px]` (entram deslizando da esquerda)
  - `scale: [start, end] → [0.9, 1]`
- Remover completamente os offsets `y` do array `FLOATING` (não são mais necessários).

### 3. Ajuste visual dos cards
- Trocar `whitespace-nowrap` por permitir wrap se necessário, e garantir `w-full` no card interno para que todos tenham a mesma largura visual.
- Manter estilo `t-glass` + ícone + label.

### 4. Fallback e responsividade
- Desktop (`lg+`, pinned): cards à esquerda do viewport, empilhados.
- Tablet / mobile: continuam usando os chips de fallback já existentes no bloco `!pinned` — nenhuma alteração ali.
- Em telas `lg` mas com viewport estreito (< 1200px) onde a coluna esquerda começa perto da borda, adicionar `xl:left-10 lg:left-4` e reduzir card para `lg:w-[210px] xl:w-[240px]` para evitar encostar no texto.

### 5. Preservar tudo o mais
- Logo, orbits, particles, halo, textos, CTAs, stats: **sem alteração**.
- Outras seções: intocadas.

## Resultado esperado

Cards ancorados no canto esquerdo do viewport, em coluna vertical bem espaçada (gap 12px), entrando um por um da esquerda conforme o usuário scrolla o hero pinado. Nunca sobrepõem a logo (que fica na coluna direita) nem uns aos outros.
