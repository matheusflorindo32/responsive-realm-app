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

## Como rodar

```bash
npm install --no-package-lock
npm run build
npx vite preview --port 4173
bun test
```

## Próxima ação

Ver a seção do último checkpoint concluído abaixo; se não houver seção posterior a esta, o próximo passo é o CP02 (cena 3D do hero).
