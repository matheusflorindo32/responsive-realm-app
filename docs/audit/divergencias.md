# Divergências — itens que precisam da sua confirmação

Auto-fixes aplicados com sucesso: 33 correções de OCR, 25 title-case, 11 extrações de carga horária, 6 mesclas de duplicatas, 2 duplicatas de formação removidas. Estado atual: **46 cursos + 10 formações + 10 formação militar**.

## 1) Formação (`06_Formacao`) — itens que você mencionou faltar

- **Licenciatura em Geografia** com estágio — não encontrada nem no JSON nem no ORCID. Envie: instituição, período, status, título do estágio.
- **Análise e Desenvolvimento de Sistemas (IFES)** — o ORCID lista como cursando (2025-07 → 2027-12). Adicionar? (a) sim (b) não é para exibir.

## 2) Cursos ainda SEM instituição (`07_Cursos`)

Total: 19. A maioria são cursos online (Alura, Google, Coursera, ENAP, etc.). Envie a plataforma correta em cada um.

| idx | curso | palpite provável |
|---|---|---|
| 2 | Recursos Tecnológicos Digitais | Escola Virtual Gov / ENAP |
| 7 | Business Intelligence: Inteligência Artificial para Negócios | Alura / Coursera |
| 8 | Domine as Ferramentas de IA da Google | Alura |
| 13 | Curso Introdutório de Pesquisa Clínica (2ª edição) | Fiocruz / UNA-SUS |
| 14 | Práticas Corporais no Meio Líquido nas Aulas de Educação Física | Instituto Península |
| 15 | Domine Ferramentas de IA para Turbinar a Sua Produtividade | Alura |
| 16 | Domine Técnicas da OPENAI | Alura |
| 17 | Diabetes - A Global Challenge | Coursera |
| 20 | Usos e Possibilidades do Google Earth no Ensino de Geografia | IFRS / Escola Virtual |
| 22 | Designer Gráfico | SENAI / Fundação Bradesco |
| 26 | Inteligência Artificial Hoje e no Futuro | Escola Virtual Gov / SEBRAE |
| 27 | Domine as Ferramentas da OpenAI para Turbinar a Sua Produtividade | Alura |
| 30 | Formação de Professores em Neuroeducação | Instituto Península / Fundação Lemann |
| 31 | Extensão Universitária em Tutoria de Educação a Distância | IFES / UAB |
| 32 | Extensão Universitária em Topografia | IFES / IFRS |
| 34 | Política e Gestão Ambiental | Escola Virtual Gov / ENAP |
| 35 | Curso A3P (Agenda Ambiental na Administração Pública) - Turma 2024 | MMA / ENAP |
| 36 | Introdução ao Pensamento Computacional | Escola Virtual Gov / IFRS |
| 37 | Conceitos e Aplicações do Censo Demográfico | IBGE / ENAP |

## 3) Cursos sem carga horária

- idx 0 — Curso de Formação de Soldados Fuzileiros Navais
- idx 1 — 2° Congresso Brasileiro em Exercício para Grupos
- idx 2 — Recursos Tecnológicos Digitais
- idx 3 — Curso Introdutório à Geopolítica Aeroespacial (1ª edição)
- idx 4 — Congresso de Fisiologia do Exercício
- idx 7 — Business Intelligence: Inteligência Artificial para Negócios
- idx 8 — Domine as Ferramentas de IA da Google
- idx 9 — Inteligência Artificial no Mundo Acadêmico
- idx 13 — Curso Introdutório de Pesquisa Clínica (2ª edição)
- idx 14 — Práticas Corporais no Meio Líquido nas Aulas de Educação Física
- idx 15 — Domine Ferramentas de IA para Turbinar a Sua Produtividade
- idx 19 — Geografia e Geopolítica na Atualidade
- idx 20 — Usos e Possibilidades do Google Earth no Ensino de Geografia
- idx 21 — Fisiologia e Esporte: o Corpo Humano Antes, Durante e Depois do Exercício
- idx 23 — Curso de Didática para Instrutores de Formação
- idx 24 — Use Generative AI as Your Thought Partner
- idx 25 — Congresso Brasileiro de Fisiologia do Exercício
- idx 26 — Inteligência Artificial Hoje e no Futuro
- idx 27 — Domine as Ferramentas da OpenAI para Turbinar a Sua Produtividade
- idx 28 — A Importância das Parcerias Internacionais na Área Espacial
- idx 30 — Formação de Professores em Neuroeducação
- idx 31 — Extensão Universitária em Tutoria de Educação a Distância
- idx 32 — Extensão Universitária em Topografia
- idx 33 — Segurança Pública e Violência contra Mulheres e Meninas: do Local ao Global
- idx 36 — Introdução ao Pensamento Computacional
- idx 37 — Conceitos e Aplicações do Censo Demográfico
- idx 41 — Estágio de Qualificação Técnica Especial em Adestramento de Cães de Guerra
- idx 42 — Curso de Formação de Soldado da Polícia Militar do Espírito Santo
- idx 43 — Curso de Adestramento de Cães para Emprego Policial
- idx 44 — Seminário de Faro de Explosivos
- idx 45 — Estágio de Tiro de Fuzil M16 - 200 metros

## 4) Congressos com data/local incompletos

Os itens 1, 4, 10, 25 são congressos com apenas ano (2025). Se você tem cidade/UF e datas exatas dos eventos, envie para eu preencher no `year_period` e criar campo `location`.

## 5) Bloqueio Lattes

O Lattes (`lattes.cnpq.br/8324016923278566`) responde com reCAPTCHA para requisições automatizadas, então não consegui cruzar com aquela fonte. Se você exportar o **CV Lattes em RTF ou PDF** e anexar, faço uma segunda passada cruzando cada curso com os dados oficiais.

---
**Como responder:** pode ser texto livre ("idx 8: instituição Alura, carga 8h") ou copiar a tabela preenchida.
