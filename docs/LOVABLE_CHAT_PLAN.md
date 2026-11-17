# Plano para o chat do Lovable — Horizonte 1

Mensagens prontas para colar no chat do projeto Tropa Científica no Lovable. Elas executam a parte do Horizonte 1 de `docs/STARTUP_GRADE_PLAN.md` que não depende de mudança de banco nem de segurança.

## Antes de começar

1. **Faça o merge do pull request #8 na `main` e espere o Lovable sincronizar.** O Lovable trabalha sobre a `main`. Sem o merge, o agente vai alterar o código antigo (sem a home nova, o 3D e o laboratório) e o resultado vai conflitar com o pull request.
2. Confira que o campo "Knowledge" do projeto no Lovable contém as regras de arquitetura e o diagnóstico (publicado em 17/11/2026).
3. Tenha em mãos: a frase de título e a descrição do site, os endereços reais das redes sociais e, para a mensagem 6, os textos legais revisados.

## Como usar

- Cole **uma mensagem por vez** e espere o Lovable terminar antes de enviar a próxima.
- Na mensagem 1, ative o modo de planejamento do Lovable, para ele responder com o plano sem escrever código.
- Troque cada `[PREENCHER]` pelo dado real antes de enviar.
- Depois de cada etapa, abra o preview e confira o que o agente listou.
- Cada mensagem consome créditos do plano do Lovable.

---

## Mensagem 1 — alinhamento (modo de planejamento)

```text
Leia o conhecimento do projeto e o arquivo docs/STARTUP_GRADE_PLAN.md.

Vamos executar o Horizonte 1 desse plano em etapas pequenas, uma por mensagem. Ainda não altere nenhum arquivo.

Responda apenas com:
1. A lista de arquivos que você pretende tocar em cada item do Horizonte 1.
2. Qualquer conflito entre o plano e o código atual.

Restrições que valem para todas as próximas mensagens:
- Não alterar autenticação, MFA, políticas RLS, certificados nem o banco de dados.
- Não remover nem renomear rotas existentes.
- Não fixar seções na tela nem interceptar a rolagem.
- Não inventar números, depoimentos, textos legais nem links.
- Ao terminar cada etapa, liste os arquivos alterados e o que eu devo conferir no preview.
```

---

## Mensagem 2 — desempenho no celular (item 1.4)

```text
Etapa 1.4 do plano: desempenho da home no celular.

Objetivo: LCP de até 2,5 s e tempo de bloqueio de até 200 ms no Lighthouse em modo celular.

Faça:
1. Converta src/assets/tropa-icon.png para WebP (e AVIF, se possível), com versões em 320, 640 e 960 px. Use <picture> com srcset e sizes no emblema do hero, na barra de navegação e no rodapé.
2. Adicione pré-carregamento da versão usada no hero no index.html.
3. Em src/components/tropa/cinematic/HeroVisual.tsx, monte a cena 3D (ScienceConstellation) somente quando a largura da tela for de 1024 px ou mais. Abaixo disso, mantenha o emblema estático que já existe como alternativa.
4. Não altere o comportamento da cena no desktop.

Não mexa em mais nada. Ao final, informe o tamanho dos novos arquivos de imagem.
```

**Conferir:** no celular, o hero mostra o emblema estático e carrega rápido; no desktop, o mapa 3D continua funcionando e clicável.

---

## Mensagem 3 — SEO e prévia de link (item 1.5)

```text
Etapa 1.5 do plano: SEO básico e prévia de link.

Faça:
1. Unifique o título e a descrição: use o mesmo texto no index.html e no Helmet de src/pages/tropa/Home.tsx. Texto: "[PREENCHER: título]" e "[PREENCHER: descrição de até 155 caracteres]".
2. Crie uma imagem de compartilhamento de 1200x630 px em public/og-image.png, com o emblema, o nome Tropa Científica e a frase do título, fundo claro. Adicione og:image, og:url e twitter:image no index.html com URL absoluta https://www.tropacientifica.com/og-image.png.
3. Troque todos os canonical relativos por URLs absolutas com https://www.tropacientifica.com.
4. Crie public/sitemap.xml com as rotas públicas: /, /laboratorio, os quatro experimentos de /laboratorio/, /sobre-a-tropa, /matheus e suas subpáginas, /certificados. Aponte para ele no robots.txt.
5. Corrija também a url do JSON-LD da home para o endereço absoluto.

Não inclua no sitemap as rotas /conteudos e /projetos-tropa.
```

**Conferir:** `/sitemap.xml` abre; ao colar o link do site no WhatsApp ou no LinkedIn (depois de publicar), aparece a imagem.

---

## Mensagem 4 — páginas de espera e redes sociais (itens 1.1 e 1.2)

```text
Etapas 1.1 e 1.2 do plano: tirar do ar o que parece inacabado.

Faça:
1. Remova "Conteúdos" e "Projetos" do menu em src/components/tropa/Navbar.tsx e da coluna "Navegar" do rodapé. Mantenha as rotas funcionando, mas sem link público.
2. Na home, troque os botões "Acompanhar conteúdos" e "Ver projetos" por um único botão principal "Abrir o laboratório", apontando para /laboratorio. Remova os links "Explorar conteúdos" e "Ver todos os projetos".
3. No rodapé (src/components/tropa/Footer.tsx), use estes endereços reais e remova o ícone de qualquer rede que eu deixar em branco:
   - YouTube: [PREENCHER ou deixar em branco]
   - Instagram: [PREENCHER ou deixar em branco]
   - LinkedIn: [PREENCHER ou deixar em branco]
   - GitHub: https://github.com/matheusflorindo32

Não apague os arquivos das páginas Conteudos.tsx e Projetos.tsx.
```

**Conferir:** nenhum link do menu, da home ou do rodapé leva a uma página com "em breve" ou "em produção"; cada ícone de rede abre o perfil certo.

---

## Mensagem 5 — limpeza (item 1.9)

```text
Etapa 1.9 do plano: limpeza.

Faça:
1. Em src/pages/tropa/Sobre.tsx, Conteudos.tsx e Projetos.tsx, substitua as classes sem definição (neon-text, glass) e os títulos em caixa alta pesada pelo mesmo padrão tipográfico da home: título com font-semibold, sem uppercase, e as classes de cartão já existentes no tema (t-card).
2. Mude o campo name do package.json para "tropa-cientifica".
3. Não altere dependências.

Liste cada classe substituída.
```

**Conferir:** a página "Manifesto" tem a mesma tipografia da home.

---

## Mensagem 6 — páginas legais (item 1.6; só depois de ter o texto revisado)

```text
Etapa 1.6 do plano: páginas legais.

Crie as rotas /privacidade e /termos dentro do layout público, com link no rodapé e na tela de cadastro.

Use exatamente os textos abaixo, sem acrescentar nem resumir nada:

POLÍTICA DE PRIVACIDADE
[PREENCHER com o texto revisado]

TERMOS DE USO
[PREENCHER com o texto revisado]

Formate com títulos, sumário no topo e data da última atualização.
```

**Conferir:** os dois links aparecem no rodapé e no cadastro; o texto publicado é idêntico ao enviado.

---

## O que não está neste arquivo, de propósito

| Item do plano | Motivo |
|---|---|
| 1.7 Política RLS de `lessons` | Mudança de segurança no banco de produção; deve ser feita com teste de usuário não matriculado e autorização expressa |
| 1.8 Regenerar `package-lock.json` | Pode mudar versões instaladas no deploy; deve ser feita em commit próprio, com build verificado |
| Horizontes 2 e 3 | Dependem de decisões do dono: posicionamento, preço, logo, conteúdo das aulas, textos em inglês |

## Limites

- Estas mensagens não foram testadas no Lovable; pode ser preciso ajustar o texto conforme a resposta do agente.
- O Lovable não mede desempenho. As metas da mensagem 2 precisam ser conferidas com Lighthouse depois.
- Texto legal precisa de revisão jurídica antes de ser publicado.
