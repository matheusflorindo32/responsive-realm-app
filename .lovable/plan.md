# Plano — Elevação Premium do Portfólio Matheus Florindo

Auditei o projeto (`src/pages/matheus/*`, `src/components/apos/*`, `src/data/apos-master.json` com 53 cursos hoje em apenas 3 categorias genéricas: "Formação Acadêmica", "Formação Complementar", "Militar/Segurança"). A lista atual de cursos em `EducationPage.tsx` é uma tabela plana com filtro por essa categoria genérica — exatamente o problema central que você descreveu.

Vou executar em 4 entregas incrementais para você conseguir revisar cada etapa. Se preferir tudo em um único push, me diga.

---

## Entrega 1 — Taxonomia + Card Institucional (base do sistema)

**1.1 Nova taxonomia de competências** (`src/data/course-taxonomy.ts`)
- 9 áreas com `id`, `label`, `icon` (lucide), `accent`, `description`, `keywords[]`:
  - `seguranca` 🛡 Segurança Pública e Operações Policiais
  - `cinotecnia` 🦮 Cinotecnia
  - `aph` 🚑 APH e Medicina Tática
  - `performance` 🏋 Educação Física e Performance Humana
  - `ambiental` 🌎 Ciências Ambientais e Geografia
  - `tech` 💻 Tecnologia, IA e Ciência de Dados
  - `drones` 🚁 Drones e Geotecnologias
  - `pesquisa` 📚 Pesquisa Científica
  - `gestao` 📊 Gestão, Liderança e Qualidade
- Função `classifyCourse(course)` que faz match por keywords no `course` + `institution` + tags. Fallback → `outros` (mas alvo é zero).
- Enriquecimento é derivado em runtime — **não** reescrevo o JSON master (mantém importação Lattes intacta). Salvo overrides manuais em `src/data/course-overrides.ts` para casos ambíguos.

**1.2 Card institucional** (substitui bloco "Afiliação" na Home)
- Novo `InstitutionalCard.tsx` com layout tipo selo acadêmico:
  ```
  ─── MEMBRO PESQUISADOR ───
  Grupo de Fisiologia Translacional
  Universidade Federal do Espírito Santo · UFES
  Centro de Educação Física e Desportos · CEFD
  ```
- Tipografia serifada no nome do grupo, hairline gold em cima, mono eyebrow. Sem aparência de badge/tag.
- Aplico em `src/pages/matheus/Home.tsx` (aside direito) e reaproveito no About.

---

## Entrega 2 — Nova página Formação (arquitetura da informação)

Refatoro `EducationPage.tsx` para 3 abas com AI premium:

- **Formação** → mantém `EducationTimeline` (já bom).
- **Cursos & capacitações** → **substituo a tabela plana** por grid de **cards expansíveis por competência** (`CompetencyAccordion.tsx`):
  - Header do card: ícone + nome da área + contador `(12)` + linha de accent + chevron.
  - Aberto: lista compacta dos cursos daquela área (curso · instituição · período · horas), com micro-tags de status.
  - Busca global filtra dentro de todas as áreas e expande automaticamente as que têm match.
  - Ordenação padrão: por contagem desc; áreas vazias ocultas.
  - Motion: expand/collapse com `framer-motion` `AnimatePresence` + `layout`.
- **Certificações destaque** → mantém `CertificationCard` grid, mas aplico a mesma linguagem visual (hairline + eyebrow mono) para consistência.

Referências de linguagem visual (21st.dev — bento/accordion premium: kokonutui, serafimcloud, motion-primitives). Não copio código; traduzo para os tokens `apos-*` existentes.

---

## Entrega 3 — Sobre Mim narrativo

Reestruturo `About.tsx` seguindo sua ordem exata:
Quem Sou → Missão → Áreas de Atuação → Experiência → Formação → Pesquisa → Projetos → Certificações → Produção Científica → Contato.

- Cada bloco = seção curta com `SectionHeader` + 1 componente denso (nunca parágrafo > 4 linhas).
- Áreas de Atuação reutiliza `ExpertiseGrid`.
- Experiência/Formação/Projetos/Certificações/Publicações são **resumos** com CTA "Ver todos" para as páginas dedicadas (evita duplicação).
- Missão em bloco editorial com aspas serifadas + accent gold.

---

## Entrega 4 — Padronização global + QA

Varro o resto do site aplicando o mesmo sistema:

- **Consistência de headers**: todo topo de página usa `SectionHeader` com eyebrow + display title + descrição curta. Ajusto Publications, Projects, ExperiencePage, Contact.
- **Cards**: `PublicationCard`, `ProjectCard`, `CertificationCard` recebem o mesmo tratamento de hairline/eyebrow/hover-lift (já parcialmente aplicado — normalizo tokens e espaçamentos).
- **Filtros**: `FilterBar` ganha contador "N de M" consistente e reset visível — já existe, padronizo cópia.
- **Home**: substituo o bloco "Formação resumida" com 4 números fixos por leitura real do dataset (contagem viva).
- **Tipografia/espaçamento**: audito e alinho escala (display/h2/h3/body/eyebrow/mono) em `index.css` — só tokens, sem quebrar tema.
- **Acessibilidade**: `aria-expanded` nos accordions, focus rings visíveis, contraste AA nas tags gold sobre muted, `prefers-reduced-motion` nos motion wrappers.
- **SEO**: cada rota com `<title>` e `description` próprios (já tem SEOHead — verifico Home/About/Contato).
- **Responsividade**: reviso breakpoints da tabela → cards no mobile e da Home hero.

Ao final rodo build e faço uma varredura visual via Playwright em Home, About, Formação (todas as abas), Publicações, Projetos, Experiência e Contato — screenshot de cada uma para conferência.

---

## Fora de escopo (confirmar se você quer também)
- Rota admin (`AdminLayout`, hub, cursos, matrículas) — sistema separado, não é o portfólio público.
- Rotas `/tropa/*` e `/app/*` — projetos distintos que compartilham só o shell.

## Detalhes técnicos
- Sem novas dependências. Uso `framer-motion` (já instalado), `lucide-react`, shadcn.
- Nenhuma mudança em `src/data/apos-master.json` (fonte importada). Classificação vive em módulo separado.
- Tokens permanecem em `index.css` / `tailwind.config.ts`; nada de cor hard-coded.
- Sem mudanças em backend/DB — puramente frontend.

Posso começar pela **Entrega 1**?
