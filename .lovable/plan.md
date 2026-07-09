
# Plano — Auditoria e reconstrução completa dos cursos, formação e congressos

## Problema

O `src/data/apos-master.json` tem erros massivos herdados do OCR/planilha original:

- **51 de 53 cursos** têm ao menos 1 problema (levantamento automático já feito).
- **Palavras quebradas** por OCR: `Bachar elado`, `Univ ersitário`, `DIGIT AIS`, `GEOPOLÍT ICA`, `TECNICA S`, `PENSAMENT O`, `COMPUT ACIONAL`, `HEAR TH`, `BRA SIL`, `Gr ande`, `Públ ica`, etc.
- **Siglas grudadas**: `Cinotecnia Policial PMES` (usuário citou), `Ações Táticas Especiais PMES`.
- **Caixa alta inconsistente** em títulos de cursos e nomes de instituição.
- **Carga horária embutida no título** (`(Carga horária: 20h)`) em vez do campo `hours` (que está `null` em ~50 registros).
- **Títulos truncados** no meio (`CURSO INTRODUTÓRIO À GEOPOLÍT ICA AEROESP ACIAL 1°...`, `USE GENERATIVE AL AS YOUR THOUGHT PERTNER` — deveria ser `AI` e `PARTNER`).
- **Instituições faltando** em 18 cursos e todo o bloco militar (índices 44–52).
- **Registro 52 vazio** (deve ser removido).
- **Duplicatas**: entradas militares "limpas" (44–51) duplicam versões OCR (41–43 etc.) sem ano nem instituição.
- **Formação**: falta **Licenciatura em Geografia** (com estágio) que o usuário disse ter entregue. Bacharelado em Ed. Física já está como "Em andamento" — ok.
- **Congressos** (dentro de `07_Cursos`): sem local, sem data completa, sem carga horária correta (ex.: "Seminário de Faro de Explosivos").
- **Anais/CONACIPS**: verificar se cada resumo tem página, autores, DOI/link corretos.

## Fonte de verdade

Você confirmou usar como referência:
- Lattes: `https://lattes.cnpq.br/8324016923278566`
- ORCID: `https://orcid.org/0009-0006-3848-0662`
- LinkedIn: `https://www.linkedin.com/in/matheus-florindo-de-deus-b953b017a`

A auditoria vai extrair dados desses perfis (via Firecrawl para o Lattes e ORCID; LinkedIn requer login) e cruzar com o JSON atual. Onde a fonte divergir do JSON, a fonte oficial vence.

## Fases

### Fase 1 — Extração das fontes oficiais (read-only)
1. Puxar o HTML do Lattes público via Firecrawl (`scrape` com `formats: ['markdown','html']`) — Lattes CNPq é público e responde a scrapers.
2. Puxar o ORCID público (`/works` e `/education`) via Firecrawl.
3. LinkedIn público bloqueia scrapers anônimos — se falhar, você exporta o "Save to PDF" do LinkedIn e eu leio via `document--parse_document`. Caso contrário fica só como fonte secundária.
4. Salvar snapshots em `src/data/_sources/lattes.md`, `_sources/orcid.json` como referência versionada.

### Fase 2 — Auditoria (nenhuma edição ainda)
Rodar 6 checadores em paralelo sobre o JSON atual, gerando `src/data/_audit/report.json` com achados por registro:

| Categoria | Detecta |
|---|---|
| `ocr_split` | palavras quebradas (`Bachar elado`, `DIGIT AIS`, etc.) — dicionário de padrões conhecidos + heurística de token curto |
| `caixa_alta` | títulos 100% em CAPS com mais de 6 letras |
| `sigla_grudada` | `PMES`/`PMS`/`DPF` sem separador |
| `hours_embed` | `(Carga horária: Xh)` no título com campo `hours` vazio |
| `campos_faltando` | `institution`, `year_period` ou `hours` vazios |
| `divergencia_fonte` | curso/formação existe no JSON mas com dados diferentes do Lattes/ORCID, ou item na fonte que não está no JSON |

Cada achado tem: `id`, `categoria`, `gravidade` (crítico/alto/médio/baixo), `descrição`, `sugestão`, `payload` (dados para o fix), `acao_recomendada` (`auto_fix` | `revisar` | `manual`).

### Fase 3 — Correções automáticas (auto_fix)
Aplicáveis sem intervenção porque a correção é determinística:

1. **De-splitting OCR** por dicionário fechado (`Bachar elado`→`Bacharelado`, `Univ ersitário`→`Universitário`, `Gr ande`→`Grande`, `Públ ica`→`Pública`, `DIGIT AIS`→`DIGITAIS`, `GEOPOLÍT ICA`→`GEOPOLÍTICA`, `AEROESP ACIAL`→`AEROESPACIAL`, `PENSAMENT O`→`PENSAMENTO`, `COMPUT ACIONAL`→`COMPUTACIONAL`, `HEAR TH`→`EARTH`, `TECNICA S`→`TÉCNICAS`, `BRA SIL`→`BRASIL`, `INSTITUT O`→`INSTITUTO`, `PENINSUL A`→`PENÍNSULA`, `PARCERIA S`→`PARCERIAS`, `PRÁTICA S`→`PRÁTICAS`, `IMPOR TÂNCIA`→`IMPORTÂNCIA`, `TUR BINAR`→`TURBINAR`, `FERRAMENT AS`→`FERRAMENTAS`, `Bra sileira`→`Brasileira`, `Leonar do`→`Leonardo`, `Centr o`→`Centro`, `ersitário`→`ersitário`, `S eminário`→`Seminário`, `Adestr amento`→`Adestramento`, `Guerr a`→`Guerra`, `Educação a`→`Educação a Distância`, `Mulher es`→`Mulheres`, `Menina s`→`Meninas`, `GL OBAL`→`GLOBAL`, etc.) — lista completa é gerada pela varredura da Fase 2.
2. **Title Case** em nomes de cursos e instituições (mantendo siglas em CAPS: PMES, DPF, IFES, ENAP, UNIASSELVI, IFRS, UERGS, AEB, CBEFIS, IP, MB).
3. **Separação de siglas grudadas**: `PolicialPMES` → `Policial - PMES`.
4. **Extração de `hours`**: regex `\(Carga horária:\s*(\d+)h?\)` no título → popula `hours` e limpa do título.
5. **Fix de OCR de conteúdo**: `AL AS`→`AI AS`, `PERTNER`→`PARTNER`, `AL YOUR`→`AI YOUR` (revisar manualmente).
6. **Deduplicação** dos militares: mesclar 41–43 (OCR) com 44–51 (limpos) preservando ano/instituição do primeiro e título limpo do segundo. Remover 52 vazio.
7. **Preenchimento das instituições militares** faltantes: PMES para cursos policiais, Marinha do Brasil para Fuzileiros/M16.

### Fase 4 — Divergências e itens novos (revisão humana leve)
Gera um arquivo `src/data/_audit/divergencias.md` com tabela lado-a-lado (JSON atual ⇄ Lattes/ORCID) para cada item onde os dados batem parcialmente. Você aprova/rejeita item a item numa próxima mensagem. Inclui:
- Cursos presentes no Lattes que não estão no JSON.
- **Licenciatura em Geografia** (falta) — reconstruída a partir do Lattes/ORCID com curso, instituição, período, status, estágio.
- Congressos com data/local/hora incompletos.

### Fase 5 — Formação e Anais CONACIPS
1. Refazer os 6 itens de `05_Anais_CONACIPS` conferindo página, autores, DOI/link contra o PDF original citado em `18_Fontes_Raw`.
2. Refazer `06_Formacao` (10 itens) contra Lattes; adicionar Licenciatura em Geografia; garantir `status`, `start_year`, `end_year`, `institution` completos.

### Fase 6 — UI: seção "Congressos"
Congressos hoje estão misturados dentro de `07_Cursos` (categorias como "Encontros/Simpósios/Congressos"). Após a limpeza, a página `Publications.tsx` ganha uma sub-seção "Congressos e Eventos" alimentada pelo taxonomy já existente, com badge de local/data.

## Entregáveis desta iteração

1. `src/data/_sources/lattes.md`, `_sources/orcid.json` — snapshots das fontes.
2. `src/data/_audit/report.json` — achados por registro, com gravidade.
3. `src/data/_audit/divergencias.md` — tabela para você aprovar.
4. `src/data/apos-master.json` — versão corrigida (apenas `auto_fix` aplicado; divergências ficam pendentes até sua aprovação).
5. `src/pages/matheus/Publications.tsx` — sub-seção Congressos alimentada dos dados limpos.

## Detalhes técnicos

- **Firecrawl**: usar via connector padrão (`standard_connectors`) porque o Lattes é externo e não temos JS local. Se o Firecrawl connector não estiver linkado no projeto, eu aviso e você conecta antes de eu rodar a Fase 1.
- **Scripts de auditoria**: Python (`scripts/audit_courses.py`, `scripts/apply_fixes.py`) executados em `code--exec`; não entram no bundle.
- **Idempotência**: rodar `apply_fixes.py` duas vezes deve dar o mesmo resultado. `report.json` inclui `hash_before`/`hash_after` por registro.
- **Auditoria é read-only** na Fase 2 — o JSON só muda na Fase 3.
- **Diff visível**: cada correção aplicada grava `{antes, depois}` num histórico em `_audit/historico.json` para você conferir depois.

## Estimativa de escopo

- ~51 cursos com fix automático + ~10 divergências para revisar.
- 1 formação faltante (Licenciatura em Geografia) para reconstruir do Lattes.
- 6 anais para reconferir.
- 3 componentes de UI tocados (Publications, Education, taxonomia).

Aguardando aprovação para começar pela Fase 1 (extração do Lattes/ORCID).
