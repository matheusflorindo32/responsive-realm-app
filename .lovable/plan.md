## Visão

Transformar o site atual (portfólio "Tropa Científica", tema dark neon cyberpunk) em uma **plataforma institucional acadêmica APOS** — Academic Personal Operating System — para posicionar Matheus Florindo de Deus como autoridade interdisciplinar (pesquisador CEFD/UFES, policial militar, desenvolvedor).

**Mudança conceitual:** a "Tropa Científica" deixa de ser a marca principal e vira **um dos projetos** de Matheus. A identidade nova é acadêmica, institucional, sóbria — o oposto do visual atual.

## Direção visual — Elite Acadêmico

Inspiração 21st.dev: Aceternity Timeline, Codehagen Timeline, Reapollo Metrics, Portfolio Hero (wisedev), Bento Grid (aceternity). Traduzido para tokens semânticos próprios — nada de copiar código.

- **Paleta clara institucional** (nova): navy `#0B1F3A` (primário), azul acadêmico `#1E3A8A`, verde científico `#0F766E` (accent), grafite `#374151`, off-white `#F8FAFC` (background), dourado `#B7791F` (detalhes editoriais)
- **Tipografia**: Fraunces (display serif editorial acadêmico) + Inter (corpo) + JetBrains Mono (labels/DOI/citações)
- **Motion**: framer-motion — fade-up sutil em scroll, hover-lift discreto em cards, número contando em métricas. Sem neon, sem glow.
- **Composição**: bento grid discreto na home, hairlines em vez de bordas grossas, generosos espaços em branco, tabelas com zebra, timeline vertical fina com marcador dourado.

## Estrutura de páginas

```
/                — Home institucional (bento + destaques, sem sobrecarga)
/publicacoes     — Artigos + Anais CONACIPS com filtros e copiar citação
/formacao        — Formação + Cursos (55) + Certificações, com busca/filtros
/projetos        — Grid de projetos (Tropa Científica, CONACIPS, Núcleo Tático, etc.)
/experiencia     — Timeline vertical (PMES, UFES/CEFD, IFES, pesquisa, tech)
/sobre           — Bio expandida institucional
/contato         — Formulário + links acadêmicos (ORCID, Lattes, GitHub, LinkedIn)
```

## Arquitetura de dados (preparada para MCP/Google Sheets)

```
src/
  data/
    types/           publication.ts, course.ts, project.ts, education.ts, ...
    mock/            dados extraídos da APOS_Master_Database_v2.xlsx
    adapters/        localMockAdapter.ts (agora) → googleSheetsAdapter.ts (depois)
    mappers/         normalizam linhas cruas em objetos tipados
  lib/
    citations.ts     generateABNT / generateVancouver / generateShort / generateProceedings
    utils.ts         normalizeTags, normalizeBoolean, formatDoi, getDoiUrl, copyToClipboard
    seo.ts           helpers de JSON-LD (Person, WebSite, ScholarlyArticle)
  config/
    client.ts        CLIENT_CONFIG (nome, domínio, brand) — reutilizável para outros clientes
    privacy.ts       SHOW_PRIVATE_DATA = false
```

Componentes React: `Layout`, `Navbar`, `Footer`, `HeroSection`, `MetricCard`, `BioSection`, `ExpertiseGrid`, `PublicationCard`, `ProceedingCard`, `ProjectCard`, `EducationTimeline`, `CourseTable`, `CertificationCard`, `ExperienceTimeline`, `AcademicLinks`, `FilterBar`, `SearchInput`, `TagBadge`, `CopyCitationButton`, `StatusBadge`, `FeaturedBadge`, `SEOHead`, `SchemaPerson`, `SchemaScholarlyArticle`, `EmptyState`, `LoadingState`.

## SEO & Schema.org

- `<title>` e `meta description` por página
- Open Graph + Twitter Card
- JSON-LD: `Person` (com `sameAs` puxando dos links), `WebSite`, `ScholarlyArticle` para publicações
- Canonical, sitemap-friendly URLs

## Regras de visibilidade e privacidade

- Toda entidade respeita `visibility` (`public`/`private`/`hidden`) e `featured`
- Home mostra apenas `featured=TRUE`; listas completas ficam nas páginas internas
- 55 cursos NÃO renderizados na Home (só total + destaques)
- Constante `SHOW_PRIVATE_DATA=false` bloqueia dados sensíveis (CPF, endereço, telefone)

## Escopo desta entrega (Fase 1)

Entregue completo nesta iteração:

1. **Setup**: adicionar `fraunces`/`inter`/`jetbrains-mono`, `react-router-dom` (rotas), reset completo do tema atual
2. **Design system novo**: reescrever `index.css` e `tailwind.config.ts` com tokens claros institucionais; refazer variantes de `button.tsx`
3. **Camada de dados**: types, mocks extraídos da planilha, adapter mock, mappers, citations, utils
4. **Componentes base**: os 25 componentes listados
5. **7 páginas** com roteamento e SEO/Schema básico
6. **Layout persistente**: Navbar sticky minimal + Footer institucional
7. **Deletar**: componentes antigos de tema cyberpunk que não se aplicam

Ficam **fora da Fase 1** (arquitetura preparada, implementação depois):
- Adapter real de Google Sheets/MCP (mocks cobrem tudo)
- Painel admin
- Toggle EN/PT
- Backend do formulário de contato (envia mensagem no submit, mostra confirmação)

## Detalhes técnicos importantes

- Todas as cores via tokens HSL em `index.css` e `tailwind.config.ts` — zero hex hardcoded em componentes
- Rotas com `react-router-dom` (já instalado)
- `react-helmet-async` (já instalado) para SEO por página
- Filtros e busca client-side com `useMemo` (mocks pequenos, sem necessidade de virtualização — exceto tabela de cursos que terá 55 linhas paginadas de 20)
- Botão "copiar citação" usa `navigator.clipboard.writeText` + toast de confirmação
- Motion: `framer-motion` (adicionar como dependência) só onde agrega — fade-up em seções, contador em métricas, hover-lift em cards
