## Objetivo

Corrigir o hero da Tropa Científica: logo limpa (só ícone, sem fundo escuro e sem texto "TROPA CIENTÍFICA") flutuando dentro do globo wireframe, sem cortar nas bordas, com o globo girando devagar em um sentido e a logo girando devagar no sentido oposto.

## Passos

1. **Gerar ícone transparente da logo**
   - Usar a ferramenta `generate_image` (premium, `transparent_background: true`) para produzir apenas o emblema hexagonal geométrico com brilho neon cyan, sem o círculo azul-marinho de fundo e sem o texto "TROPA CIENTÍFICA".
   - Salvar em `src/assets/tropa-icon.png` e criar `tropa-icon.png.asset.json` via `lovable-assets` (CDN).

2. **Ajustar `TropaLogo3D.tsx`**
   - Trocar a textura para o novo ícone transparente.
   - Remover a segunda plane cruzada (elimina o "duplicado" e o efeito de arte quebrada). Deixar apenas 1 plane frontal com billboard sutil.
   - Reduzir o tamanho da logo para caber confortavelmente dentro do globo (~55–60% do diâmetro do globo), garantindo que nada saia da esfera.
   - Ajustar câmera/`fov` e o `aspect-square max-w` do container para que o globo inteiro caiba na viewport (hoje ele estende pra fora e "corta").
   - Rotações opostas:
     - Globo: `rotation.y -= delta * 0.15`
     - Logo (group): `rotation.y += delta * 0.08` (bem devagar)
   - Manter `Float` só com `floatIntensity` (movimento vertical suave), zerando `rotationIntensity` para não competir com o giro controlado.
   - Adicionar leve `emissive`/glow via material `MeshBasicMaterial` + duplicata blur atrás para o efeito neon já casar com o ícone transparente.

3. **Enquadramento no hero**
   - No `Home.tsx` da Tropa: reduzir `max-w-[520px]` para `max-w-[440px]` e adicionar `overflow-visible` no container do Canvas para não cortar o glow. Verificar em viewport 1204px que o globo fica inteiro dentro da coluna direita (`lg:col-span-5`).

4. **Limpeza**
   - Manter o asset antigo `tropa-logo.png.asset.json` (pode ser usado em outro lugar como favicon/OG). Não deletar.

## Detalhes técnicos

- Arquivos alterados: `src/components/tropa/TropaLogo3D.tsx`, `src/pages/tropa/Home.tsx`.
- Arquivos criados: `src/assets/tropa-icon.png` (gerado) e `src/assets/tropa-icon.png.asset.json`.
- Sem novas dependências.
- Sem mudanças de rota, tema ou dados.

## Fora de escopo

- Refazer o resto do site.
- Trocar a fonte ou cores do hero.
- Substituir a logo em outras áreas (favicon, footer, etc.).
