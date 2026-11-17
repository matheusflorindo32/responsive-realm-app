# Scientific Elite V2 — registro de progresso

Documento de continuidade. Qualquer pessoa ou agente deve conseguir retomar o trabalho só com este arquivo e o histórico de commits da branch.

## Objetivo

Elevar a home pública da Tropa Científica a um padrão editorial e científico, adicionar uma experiência 3D com função narrativa e criar o Interactive Science Lab em `/laboratorio` — sem tocar em produção, banco, autenticação, MFA, RLS ou certificados.

## Regras que não mudam

- Trabalhar só na branch `agent/science-lab`. Não fazer merge na `main` nem publicar sem autorização do dono do projeto.
- `AGENTS.md`: seções públicas em fluxo vertical normal (sem cenas fixadas nem rolagem sequestrada); manter o fallback de backend do `vite.config.ts`; não mexer no fluxo de MFA.
- Nenhuma migração, nenhuma escrita no banco. O laboratório roda inteiro no navegador com dados simulados e identificados como tal.

## Baseline (CP00)

| Item | Valor |
|---|---|
| Repositório | `matheusflorindo32/responsive-realm-app` |
| Commit de origem (`main`) | `ec229e4ca2acc8a11833f1af56382831f6af4644` |
| Branch de trabalho | `agent/science-lab` (criada a partir do commit acima) |
| Stack | Vite 5, React 18, TypeScript, Tailwind 3, shadcn/Radix, React Router 6, GSAP, Three.js 0.160 + R3F 8 + Drei 9 |
| Build inicial | `npm run build` passou; JS único de 1.450,55 kB (422,21 kB gzip); CSS 178,43 kB |
| Testes iniciais | `bun test`: 4 aprovados, 0 falhas (`tests/mfa-setup.test.ts`) |
| Altura da home | 9.222 px (1440 de largura) e 13.480 px (390 de largura) |

### Problemas que já existiam na `main` (não introduzidos aqui)

1. `npm ci` falha: `package-lock.json` está fora de sincronia com `package.json` (zod 4, `@lovable.dev/mcp-js` e outros). O workflow `build-verification.yml` usa `npm ci`, então o CI falha em qualquer branch `agent/**` até o lockfile ser regenerado. Nesta branch o lockfile **não** foi alterado; a instalação local usou `npm install --no-package-lock`.
2. Nenhuma rota usava carregamento sob demanda; todo o site ia em um único arquivo JS.
3. A home repetia blocos: "Autoridade" duas vezes, chamada final duas vezes, "frentes" duas vezes e duas numerações 01–06 independentes.
4. `Atmosphere.tsx` carrega fotos direto de Unsplash, Pexels e Wikimedia (dependência de terceiros em tempo de execução) com temática militar (rapel de helicóptero, torniquete, drone em exercício).
5. O painel "operacional · simulação" e o bloco "SYS · TROPA-CORE" exibiam números inventados (0.82, 0.64, uplink 99,2 %).
6. `TropaLogo3D.tsx` e `src/components/tropa/sections/*` existem mas não são usados por nenhuma página.
7. Os ícones sociais do rodapé apontam para as páginas iniciais de YouTube, Instagram, LinkedIn e GitHub, não para perfis da Tropa.

## Checkpoints

### CP00 — proteção, inspeção e baseline — concluído

Sem alteração de código. Este documento registra o baseline.

### CP01 — experiência cinematográfica premium — concluído

Arquivos:

- `src/components/tropa/cinematic/narrative.tsx` (novo): capítulos, âncoras, `useReveal`, `ScrollProgress`, `Chapter`, `ChapterMark`, `Ghost`.
- `src/components/tropa/cinematic/HeroVisual.tsx` (novo): emblema estático do hero (base para o 3D do CP02).
- `src/components/tropa/cinematic/CinematicJourney.tsx`: hero + capítulos 01 Ciência, 02 Pesquisa, 03 Tecnologia.
- `src/components/tropa/cinematic/EditorialHome.tsx`: capítulos 04 Aplicação, 05 Educação, 06 Inovação + chamada final.
- `src/pages/tropa/Home.tsx`: fio de progresso de leitura.
- `src/components/tropa/Navbar.tsx`: `aria-expanded`/`aria-controls` no menu móvel, rótulo da navegação, foco visível.
- `src/App.tsx`: 48 páginas passam a ser carregadas com `React.lazy` + `Suspense`. Nenhuma rota foi removida ou renomeada.

O que mudou para o visitante:

- Uma narrativa única de seis capítulos (Ciência → Pesquisa → Tecnologia → Aplicação → Educação → Inovação) com numeração contínua e índice clicável no hero.
- Hero com hierarquia tipográfica maior e duas chamadas para ação (antes não havia nenhuma).
- Blocos duplicados fundidos; todo texto institucional único foi mantido.
- Revelações com GSAP por capítulo, sem pin e sem scrub de layout; desligadas com `prefers-reduced-motion`.

Removido da home de propósito (os arquivos continuam no repositório):

- Camadas de foto de `Atmosphere.tsx` (itens 4 acima).
- Painel de medidores e bloco de telemetria com números inventados (item 5).

Validação:

- `npm run build`: passou. JS inicial 808,15 kB (248,47 kB gzip), queda de 44 % sobre o baseline.
- `bun test`: 4 aprovados.
- ESLint nos arquivos alterados: 0 erros, 3 avisos de fast-refresh em `narrative.tsx`.
- 15 rotas abertas em navegador headless sem erro de página: `/`, `/conteudos`, `/projetos-tropa`, `/sobre-a-tropa`, `/matheus`, `/matheus/publicacoes`, `/sobre` (redireciona), `/login`, `/cadastro`, `/app` e `/admin` (redirecionam para login), `/certificados`, `/certificado/XYZ`, `/jarvis-preview`, rota inexistente (404).
- Sem rolagem horizontal em 1440 px e 390 px. Altura da home: 6.918 px e 10.795 px.

Não verificado: contraste medido por ferramenta, leitor de tela real, Safari/iOS real.

### CP02 — experiência 3D científica — concluído

Arquivos:

- `src/components/tropa/cinematic/ScienceConstellation.tsx` (novo): cena React Three Fiber.
- `src/components/tropa/cinematic/HeroVisual.tsx`: carrega a cena sob demanda e mantém o emblema estático como alternativa.

O que é: um octaedro cujos seis vértices são os seis capítulos da home, com o emblema da marca no centro. As arestas do percurso de leitura são mais fortes, um pulso percorre 01→06, o ponteiro gera paralaxe leve. Passar o cursor (ou focar) um item do índice do hero destaca o nó correspondente e vice-versa; clicar em um nó leva ao capítulo.

Condições atendidas:

| Condição | Como |
|---|---|
| Carregamento sob demanda | `React.lazy`; chunk `ScienceConstellation` separado (812,92 kB, 220,55 kB gzip), pedido só após `requestIdleCallback` |
| Sem WebGL | teste de contexto antes de importar; fica o emblema estático |
| Movimento reduzido | sem rotação nem pulso; `frameloop="demand"`, redesenha só quando o destaque muda |
| Custo de renderização | ~20 malhas básicas, sem luzes, sombras ou pós-processamento; DPR máximo 1,5; `frameloop="never"` fora da tela ou com a aba oculta |
| Mobile | menos pontos, câmera mais afastada, `touch-action: pan-y` no canvas (a rolagem vertical nunca é capturada) |
| Erros | `SceneBoundary` troca a cena pelo emblema estático |
| Não bloquear conteúdo | o texto do hero e o emblema aparecem antes; a cena entra com fade |
| Acessibilidade | canvas com `aria-hidden`; a mesma navegação existe como lista de links no índice de capítulos |

Validação (Chromium headless com SwiftShader): cena monta em 1440 px e 390 px sem erro de console; sem WebGL não há canvas e o emblema permanece; com movimento reduzido a cena é estática; clique no nó "01 Ciência" rolou a página até `#ciencia`. `npm run build` e `bun test` (4/4) passaram.

Não verificado: taxa de quadros em aparelho real e GPU real (o teste usa renderização por software).

Observação: o chunk 3D é grande porque `@react-three/drei` é importado pelo índice do pacote. Importar `Html` e `Billboard` por caminho direto pode reduzi-lo; não foi feito para não arriscar a compatibilidade nesta entrega.

**Atenção ao commitar:** `npm run build` regrava `supabase/functions/mcp/index.ts` (plugin MCP do Lovable). Rode `git checkout -- supabase/functions/mcp/index.ts` antes de cada commit; esse arquivo não faz parte deste trabalho.

### CP03 — Interactive Science Lab — concluído

Rotas novas (dentro do layout público, sem autenticação): `/laboratorio` e `/laboratorio/:slug`.

Arquivos:

- `src/lib/lab/embedding.ts` (novo): matemática pura — gerador com semente, cosseno, ângulo, PCA por iteração de potência, base ortonormal aleatória, vizinhos, preservação de vizinhança.
- `tests/lab-embedding.test.ts` (novo): 16 testes.
- `src/data/lab-experiments.ts` (novo): registro de experimentos e áreas. **É o ponto de extensão do laboratório**; o cabeçalho do arquivo explica como adicionar um experimento.
- `src/pages/lab/LabHub.tsx`, `src/pages/lab/LabExperiment.tsx` (novos).
- `src/components/lab/experiments/embedding/` (novo): `EmbeddingExplorer.tsx` (estado e painéis), `EmbeddingScene.tsx` (cena 3D, sob demanda), `EmbeddingNotes.tsx` (explicação, limites, referências).
- `src/App.tsx` (2 rotas), `src/components/tropa/Navbar.tsx` e `Footer.tsx` (link "Laboratório"), `EditorialHome.tsx` (faixa do laboratório no capítulo 06).

3D Embedding Space Explorer — o que faz:

- 51 termos em 6 grupos mais 3 termos-ponte, vetores de 16 dimensões **simulados** (centro do grupo + ruído gaussiano, semente fixa). A tela mostra o selo "Dados simulados" e uma seção de limites.
- Nuvem 3D com rotação por arraste, botões de zoom, rotação automática pausável; zoom por roda/pinça é opcional e vem desligado para não interferir na rolagem.
- Seleção de A e B por clique no ponto ou pela lista de termos (teclado). Leitura: cosseno, ângulo, vizinhos verdadeiros e a posição de cada um na figura.
- Três projeções (PCA, aleatória, eixos 1–3) com tabela de variância retida e vizinhança preservada, recalculada a cada mudança.
- Controles de k (3–8), ruído (0,10–1,20), nova amostra e restaurar; roteiro guiado de quatro passos.
- Sem WebGL ou em caso de erro: gráfico 2D em SVG com a mesma seleção e os mesmos painéis.

Validação (Chromium headless): fluxo completo em 1440, 820 e 390 px sem erro de console e sem rolagem horizontal; passo 1 do roteiro lista 5 vizinhos; projeção aleatória reduz os vizinhos visíveis de 5/5 para 3/5 na semente padrão; k=8 pelo teclado lista 8 linhas; seleção pelo teclado funciona; sem WebGL aparece o SVG. `bun test`: 20 aprovados. `npm run build`: passou; chunks `EmbeddingExplorer` 30 kB e `EmbeddingScene` 19 kB (o Three.js é compartilhado com o chunk do hero).

Não verificado: links das referências não foram abertos a partir deste ambiente (rede restrita); os DOIs foram escritos de memória e devem ser clicados uma vez antes de publicar. Leitor de tela real e aparelhos físicos não testados.

### CP04 — expansão opcional — em andamento (um experimento por commit)

Peças compartilhadas criadas nesta fase: `src/components/lab/ui.tsx` (painel, controle deslizante, seletor, estatística, selo de simulação, bloco de explicação/limites/referências).

#### 4.1 Token Sampling Explorer — concluído

- `src/lib/lab/sampling.ts`: softmax com temperatura, top-k, top-p, entropia, opções efetivas, sorteio. `tests/lab-sampling.test.ts`: 14 testes.
- `src/components/lab/experiments/sampling/TokenSamplingExplorer.tsx`: três situações com pontuações escolhidas à mão (selo "Pontuações inventadas"), barras da distribuição final sobre a distribuição só com temperatura, sorteio de 1, 100 ou 5.000 palavras com a frequência observada marcada no gráfico.
- Validação headless em 1440 e 390 px, sem erro de console: temperatura 0,10 leva a palavra mais provável de 37,7 % para 99,3 %; top-k 3 corta 7 palavras e nenhuma cortada é sorteada em 5.000 tentativas.

#### 4.2 Retry & Backoff Simulator — concluído

- `src/lib/lab/backoff.ts`: espera por estratégia (sem espera, fixa, exponencial, exponencial com variação total) e simulação de eventos discretos com fila de prioridade, determinística por semente. `tests/lab-backoff.test.ts`: 12 testes (valores conhecidos, conservação das contas, capacidade nunca excedida, casos-limite).
- `src/components/lab/experiments/backoff/BackoffSimulator.tsx`: gráfico SVG de chamadas atendidas e recusadas no tempo, com a queda sombreada e a linha de capacidade; sete controles; tabela comparando as quatro estratégias na mesma falha.
- Validação headless em 1440 e 390 px, sem erro de console. Com os valores padrão (100 clientes, queda de 8 s, 100 chamadas/s, 8 tentativas): sem espera e espera fixa atendem 0 de 100 com 800 chamadas; exponencial atende 100 com pico 13; com variação atende 99 com pico 5.

## Como rodar

```bash
npm install --no-package-lock
npm run build
npx vite preview --port 4173
bun test
```

## Próxima ação

Ver a seção do último checkpoint concluído abaixo; o próximo passo é o CP04 (um experimento por vez: Token Sampling, Retry & Backoff, Wilson).
