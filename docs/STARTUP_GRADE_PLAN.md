# Tropa Científica — análise geral e plano para padrão de startup internacional

Data: 17/11/2026 · Base: branch `agent/science-lab` (commit `b48736b`) · Autor da análise: agente, a pedido do dono do projeto.

## 1. Veredito

O site ainda parece amador, e a causa principal **não é visual**. É de produto: a Tropa descreve o que faz em vez de mostrar. Um visitante não encontra um único conteúdo publicado, curso aberto, caso real, número ou depoimento. Duas das cinco páginas do menu são páginas de espera. Sem prova, nenhuma camada de animação ou 3D sustenta a impressão de empresa séria.

Em segundo lugar vêm a identidade fragmentada (três visuais diferentes no mesmo domínio), o desempenho ruim em celular e a ausência de itens que toda startup internacional tem: versão em inglês, páginas legais, imagem de compartilhamento.

O que já está em bom nível e deve ser preservado: autenticação com MFA, RLS em todas as tabelas, validação pública de certificados, o laboratório interativo com matemática testada e a página do fundador, que tem conteúdo real.

## 2. Método e limites

- Inspeção do código e de capturas de tela de 8 páginas públicas (1440 px).
- Lighthouse 12.8.2 na build local desta branch, com emulação de celular lento e de desktop.
- Consulta ao banco (somente leitura) feita na auditoria inicial.
- **Não medido:** produção real (tropacientifica.com), dados de uso (Analytics), aparelhos físicos, teste com usuários. O Lighthouse local usa renderização 3D por software, o que piora o resultado da cena 3D em relação a um celular real.
- As metas de desempenho e contraste abaixo vêm de padrões públicos: [Core Web Vitals](https://web.dev/articles/vitals) (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1) e [WCAG 2.2](https://www.w3.org/TR/WCAG22/) nível AA (contraste 4,5:1 para texto normal).

## 3. Diagnóstico

Gravidade: **A** bloqueia a percepção de empresa séria · **B** enfraquece · **C** acabamento.

### 3.1 Prova e conteúdo

| # | Achado | Evidência | Grav. |
|---|---|---|---|
| 1 | "Conteúdos" é uma página de espera no menu principal | Título "Em produção" e seis cartões "Conteúdo #1…#6 — Slot reservado para próximo episódio" (`src/pages/tropa/Conteudos.tsx`) | A |
| 2 | "Projetos" tem cartão "Slot em breve" | `src/pages/tropa/Projetos.tsx` | A |
| 3 | Nenhum curso disponível | Banco com 0 cursos, 0 módulos, 0 aulas; a formação de 33 aulas está só no Drive | A |
| 4 | Sem prova social | Nenhum número de alunos, depoimento, parceiro, caso ou publicação citada na home | A |
| 5 | Redes sociais apontam para as páginas iniciais das plataformas | Rodapé com `https://youtube.com`, `https://instagram.com`, `https://linkedin.com`, `https://github.com` | A |
| 6 | A home fala de si mesma | Seis capítulos de texto institucional; o único artefato real é o laboratório | B |

### 3.2 Posicionamento

| # | Achado | Evidência | Grav. |
|---|---|---|---|
| 7 | Não fica claro o que a Tropa vende | A home mistura hub editorial, formação, sistemas, segurança pública e drones; não há oferta nem preço | A |
| 8 | Mensagens divergentes | `index.html`: "Ciência, IA e Segurança Pública"; home: "Ciência, IA e Inovação Aplicada" | B |
| 9 | Sinal de projeto de uma pessoa | "Sobre o fundador" é o item de maior destaque do menu, antes de qualquer produto | B |

### 3.3 Marca e sistema visual

| # | Achado | Evidência | Grav. |
|---|---|---|---|
| 10 | Três identidades no mesmo domínio | Tropa (claro, azul, Space Grotesk), fundador (serifa Fraunces, marinho e verde), autenticação (escuro, ciano) | A |
| 11 | Cinco famílias tipográficas | Fraunces, Inter, JetBrains Mono, Orbitron, Space Grotesk; 128 arquivos de fonte na build | B |
| 12 | Marca só em imagem rasterizada | `tropa-icon.png`, 345 kB, com brilho e efeitos; não há versão vetorial, monocromática nem reduzida | B |
| 13 | Páginas secundárias com estilos órfãos | 7 usos de `neon-text`, `glass` e títulos em caixa alta pesada, classes que não existem mais no CSS | B |
| 14 | Metadados de protótipo | Projeto no Lovable chamado "My Awesome Portfolio"; pacote `vite_react_shadcn_ts` | C |

### 3.4 Desempenho

Lighthouse, build local desta branch:

| Cenário | Nota | FCP | LCP | TBT |
|---|---|---|---|---|
| Home, celular | 45 | 3,4 s | 6,7 s | 1.370 ms |
| Home, celular, sem a cena 3D | 64 | 3,5 s | 7,1 s | 260 ms |
| Laboratório (índice), celular | 85 | 2,6 s | 3,8 s | 70 ms |
| Home, desktop | 98 | 0,7 s | 1,1 s | 80 ms |

| # | Achado | Evidência | Grav. |
|---|---|---|---|
| 15 | LCP de 6,7 s no celular, quase o triplo do limite de 2,5 s | O elemento medido é o emblema (`tropa-icon.png`, PNG de 345 kB); Lighthouse estima 296 kB de economia com formato moderno | A |
| 16 | A cena 3D do hero custa caro em celular | TBT sobe de 260 ms para 1.370 ms e a nota cai de 64 para 45. **Esse custo foi introduzido neste trabalho.** | A |
| 17 | JS inicial ainda grande | 812 kB; 232 kB não usados na home | B |
| 18 | CSS bloqueia a renderização | Um arquivo de 183 kB; 454 ms estimados | B |

### 3.5 Descoberta, compartilhamento e alcance internacional

| # | Achado | Evidência | Grav. |
|---|---|---|---|
| 19 | Só português | Nenhuma estrutura de idiomas; `lang="pt-BR"` fixo | A (para o objetivo internacional) |
| 20 | Sem imagem de compartilhamento | Não há `og:image` nem `twitter:image`; o link colado em redes aparece sem prévia | B |
| 21 | Canonical inválido | `href="/"` relativo; reprovado pelo Lighthouse | B |
| 22 | Sem sitemap | `public/` não tem `sitemap.xml` | B |
| 23 | Site renderizado só no navegador | Robôs e prévias de link recebem HTML vazio antes do JavaScript | B |

### 3.6 Confiança, legal e acessibilidade

| # | Achado | Evidência | Grav. |
|---|---|---|---|
| 24 | Sem política de privacidade nem termos de uso | Não há rota para nenhum dos dois, embora o site tenha cadastro, pagamentos modelados e MFA | A |
| 25 | Possível exposição de aulas a não matriculados | Política RLS "Public reads lesson metadata" (pendente desde a auditoria inicial; só os primeiros 220 caracteres foram lidos) | A quando houver aulas pagas |
| 26 | Contraste e ordem de títulos | Lighthouse acessibilidade 94: frases do capítulo Pesquisa começam com opacidade baixa; níveis de título fora de ordem | C |

### 3.7 Engenharia

| # | Achado | Evidência | Grav. |
|---|---|---|---|
| 27 | CI vermelho | `npm ci` falha por `package-lock.json` fora de sincronia; existe na `main` | B |
| 28 | Sem medição de uso | Nenhum evento de produto instrumentado; a métrica-guia do projeto (cursos concluídos por mês) não é observável | B |
| 29 | Testes só de matemática e MFA | 57 testes; nenhum de interface ou de fluxo | C |

## 4. Decisão que vem antes de tudo: o que a Tropa é

Sem essa decisão, qualquer redesenho repete o problema 7. Três caminhos plausíveis:

| Opção | O que é | A favor | Contra |
|---|---|---|---|
| **A. Escola de IA aplicada** (recomendada) | Produto principal: a formação "Construtor de IA Aplicada" (33 aulas, 5 trilhas). O laboratório é a porta de entrada gratuita. | O conteúdo já existe no Drive; a plataforma de cursos, matrícula e certificado já está pronta; coincide com a métrica-guia registrada no próprio repositório | Exige publicar as aulas e definir preço |
| B. Estúdio de ciência aplicada | Vende projetos: dashboards, automações, pesquisa aplicada | Aproveita a experiência do fundador | Não há casos documentados no site; depende de venda consultiva |
| C. Publicação de divulgação científica | Mídia: artigos, vídeos, infográficos | Menor barreira de entrada | Não há conteúdo publicado; modelo de receita indefinido |

**Recomendação: A**, com B como oferta secundária quando houver dois ou três casos documentados. É a única opção em que o produto já está construído e só falta colocá-lo na vitrine.

## 5. Plano em três horizontes

Cada item tem um critério de pronto verificável. "Dono" indica o que só o dono do projeto pode fornecer ou decidir.

### Horizonte 1 — remover os sinais de amadorismo (até 2 semanas)

| # | Entrega | Critério de pronto | Depende do dono |
|---|---|---|---|
| 1.1 | Tirar páginas de espera do ar | Nenhuma rota pública com "em breve", "em produção" ou "slot"; "Conteúdos" e "Projetos" saem do menu até terem ao menos 3 itens reais | Decidir o que entra |
| 1.2 | Redes sociais reais | Cada ícone abre o perfil da Tropa; os que não existem são removidos | URLs dos perfis |
| 1.3 | Uma só mensagem | Mesmo título e descrição em `index.html`, home e imagem de compartilhamento | Aprovar a frase |
| 1.4 | Desempenho em celular | LCP ≤ 2,5 s e TBT ≤ 200 ms no Lighthouse celular: emblema em WebP/AVIF com pré-carregamento; cena 3D só em telas largas ou após interação | — |
| 1.5 | Compartilhamento e SEO básico | `og:image` 1200×630, canonical absoluto, `sitemap.xml`; Lighthouse SEO 100 | — |
| 1.6 | Páginas legais | `/privacidade` e `/termos` no rodapé e no cadastro | Texto revisado por advogado; razão social e contato do controlador (LGPD) |
| 1.7 | Fechar a política de aulas | Aula não gratuita não devolve vídeo nem conteúdo a quem não está matriculado, testado com usuário sem matrícula | Autorizar mudança de RLS |
| 1.8 | CI verde | `npm ci && npm run build` passam no GitHub | Autorizar regenerar o lockfile |
| 1.9 | Limpar estilos órfãos e metadados | Nenhuma classe sem definição; nome do projeto e do pacote corrigidos | — |

### Horizonte 2 — produto e marca (2 a 6 semanas)

| # | Entrega | Critério de pronto | Depende do dono |
|---|---|---|---|
| 2.1 | Publicar a trilha T0 (6 aulas) na plataforma | Aluno de teste se cadastra, assiste, conclui e recebe certificado válido | Vídeos e materiais finais; preço ou gratuidade |
| 2.2 | Página da formação | Programa, para quem é, o que se entrega em cada trilha, método 4E, preço, perguntas frequentes | Preço e condições |
| 2.3 | Home orientada a produto | Primeira tela: o que é, para quem, uma ação principal (começar a T0). A narrativa em capítulos encolhe para metade | Aprovar a nova hierarquia |
| 2.4 | Sistema de marca | Logo vetorial em três versões (completa, símbolo, monocromática), duas famílias tipográficas, uma paleta; as três áreas do site usam o mesmo sistema | Contratar ou aprovar o redesenho do logo |
| 2.5 | Laboratório dentro das aulas | Cada experimento aparece na aula correspondente; tipo de aula `lab` no banco | Autorizar migração |
| 2.6 | Prova | Três casos ou depoimentos reais, com nome e autorização; números verdadeiros | Coletar e autorizar |
| 2.7 | Medição | Eventos de cadastro, início de aula, conclusão e certificado; painel com a métrica-guia | Escolher ferramenta; consentimento conforme LGPD |

### Horizonte 3 — alcance internacional e escala (6 a 12 semanas)

| # | Entrega | Critério de pronto | Depende do dono |
|---|---|---|---|
| 3.1 | Inglês | Rotas `/en`, `hreflang`, seletor de idioma; home, formação e laboratório traduzidos e revisados por falante nativo | Aprovar textos; decidir se as aulas terão legenda |
| 3.2 | HTML pronto para robôs | Páginas públicas pré-renderizadas; prévia de link correta em WhatsApp, LinkedIn e X | Decidir entre pré-renderização e migração de framework |
| 3.3 | Pagamento | Compra da formação ponta a ponta em ambiente de teste, com matrícula automática | Conta no provedor; política de reembolso |
| 3.4 | Qualidade contínua | Testes de fluxo (cadastro, aula, certificado) e orçamento de desempenho no CI | — |
| 3.5 | Acessibilidade verificada | Auditoria com leitor de tela e contraste medido; Lighthouse acessibilidade 100 | — |
| 3.6 | Trilhas T1 a T4 publicadas | 33 aulas no ar | Materiais finais |

## 6. Metas mensuráveis

| Indicador | Hoje | Meta H1 | Meta H3 |
|---|---|---|---|
| Rotas públicas com conteúdo de espera | 2 | 0 | 0 |
| Lighthouse desempenho, home, celular | 45 | ≥ 85 | ≥ 90 |
| LCP, home, celular | 6,7 s | ≤ 2,5 s | ≤ 2,0 s |
| Lighthouse SEO | 92 | 100 | 100 |
| Lighthouse acessibilidade | 94 | ≥ 97 | 100 |
| Identidades visuais no domínio | 3 | 3 | 1 |
| Famílias tipográficas | 5 | 5 | 2 |
| Aulas publicadas | 0 | 0 | 33 |
| Idiomas | 1 | 1 | 2 |
| Cursos concluídos com certificado por mês (métrica-guia) | não medido | medido | meta a definir após 4 semanas de dados |

## 7. Riscos e onde este plano pode falhar

- **Conteúdo é o gargalo, não código.** Os itens 2.1, 2.6 e 3.6 dependem de material e autorizações que só o dono tem. Se atrasarem, o site continua sem prova, por melhor que fique o resto.
- **Redesenho de marca sem designer.** O item 2.4 feito só por agente tende a repetir o aspecto genérico. Vale contratar um designer para o logo e a paleta.
- **Tradução automática** sem revisão nativa passa impressão pior do que não ter inglês.
- **Textos legais** escritos por agente não substituem revisão jurídica.
- **As notas do Lighthouse foram medidas em ambiente local.** Os valores em produção podem ser melhores ou piores; a meta deve ser conferida com dados de campo depois da publicação.

## 8. Próximo passo sugerido

Executar o Horizonte 1 nesta mesma branch, na ordem 1.4 → 1.5 → 1.9 → 1.1, que não depende de nenhuma informação do dono. Em paralelo, o dono responde: qual das opções A/B/C, URLs das redes, autorização para lockfile e para a política de aulas.
