# Divergências e itens que precisam da sua confirmação

> Gerado por `scripts/audit_courses.py`. Auto-fixes já aplicados: 33 correções OCR, 25 title-case, 11 extrações de carga horária, 4 mesclas de duplicatas.

## 1) Cursos com título truncado (falta completar)

Estes tiveram o texto cortado pela planilha/OCR e precisam ser completados a partir do Lattes ou do certificado original.

| idx | título atual | motivo |
|---|---|---|
| 1 | Bacharelado em Educação Física (em andamento | parênteses aberto |
| 9 | Business Intelligence: Inteligência Artificial para | termina em "para" |
| 15 | Introdutório de pesquisa clínica (2° edição | parênteses aberto |
| 16 | Práticas Corporais no Meio Líquido Nas Aulas de | termina em "de" |
| 17 | Domine Ferramentas de IA para Turbinar a | termina em "a" |
| 23 | Fisiologia e Esporte: o Corpo Humano Antes, | termina em "antes" |
| 27 | Congresso Brasileiro de Fisiologia do | termina em "do" |
| 29 | Domine As Ferramentas da OPENAI para Turbinar a | termina em "a" |
| 30 | A Importância das Parcerias Internacionais na | termina em "na" |
| 33 | Extensão Universitária em Tutoria de Educação a | termina em "a" |
| 35 | Segurança Pública e Violência contra Mulheres e Meninas: do | termina em "do" |

## 2) Cursos sem instituição (preencher manualmente)

| idx | curso |
|---|---|
| 1 | Bacharelado em Educação Física (em andamento |
| 4 | Recursos Tecnológicos Digitais |
| 9 | Business Intelligence: Inteligência Artificial para |
| 10 | Domine as Ferramentas de IA da Google |
| 15 | Introdutório de pesquisa clínica (2° edição |
| 16 | Práticas Corporais no Meio Líquido Nas Aulas de |
| 17 | Domine Ferramentas de IA para Turbinar a |
| 18 | Domine Técnicas da OPENAI |
| 19 | Diabetes - a Global Challenge |
| 22 | Usos e Possibilidades do Google Earth no Ensino |
| 24 | Designer Gráfico |
| 28 | Inteligência Artificial Hoje e no Futuro |
| 29 | Domine As Ferramentas da OPENAI para Turbinar a |
| 32 | Formação de professores em neuroeducação |
| 33 | Extensão Universitária em Tutoria de Educação a |
| 34 | Extensão Universitária em Topografia |
| 36 | Política e Gestão Ambiental |
| 37 | Curso A3P - Turma 2024 |
| 38 | Introdução ao Pensamento Computacional |
| 39 | Conceitos e Aplicações do Censo Demográfico |

## 3) Cursos sem carga horária

(8 registros — omitidos aqui, veja `docs/audit/report.json`)

## 4) Formação — item do ORCID não presente no JSON

O ORCID lista **Análise e Desenvolvimento de Sistemas** no IFES (2025-07-26 → 2027-12-22, cursando).
Isso NÃO está em `06_Formacao`. Você quer:
- (a) Adicionar como nova formação em andamento?
- (b) Ignorar (não é para exibir no portfólio)?

Você também mencionou uma **Licenciatura em Geografia** com estágio — não encontrei nem no JSON nem no ORCID. Se ela existe, preciso: curso, instituição, período, status.

## 5) Congressos (dentro de 07_Cursos) sem local/data

Os itens 3, 6, 12, 27 (categorias de congresso) só têm ano. Se você tem local (cidade/UF) e data exata, envie para eu preencher.

---

**Próximo passo:** responder este arquivo com correções (formato livre — pode ser 'idx 6 título completo: X, hora Y, instituição Z' etc.) que eu aplico numa segunda passada.
