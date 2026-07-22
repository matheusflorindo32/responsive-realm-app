
# Mini-Doc Cinematográfico — Tropa Científica

Produção de vídeo premium 60–90s usando exclusivamente o Higgsfield MCP (`mcp_custom_LkSAk`), entregue em duas versões (9:16 Reels/Shorts/TikTok e 16:9 YouTube/Facebook), com narração PT-BR, legendas queimadas e trilha épica.

## Escopo

- 8 cenas de ~8–10s cada (total ~72s).
- Cada cena: prompt Higgsfield otimizado + narração PT-BR + SFX.
- Renderização em 1080p pelo motor (upscale opcional para 4K via `upscale_video`).
- Montagem final via `explainer_video` (stitch + voice-over + legendas queimadas).
- Duas exportações finais: `tropa_cientifica_9x16.mp4` e `tropa_cientifica_16x9.mp4`.

## Roteiro (PT-BR, narração + on-screen)

| # | Função | Narração (PT-BR) | Visual |
|---|---|---|---|
| 1 | Gancho | "E se a ciência pudesse antecipar o crime, salvar vidas e reescrever o futuro?" | Macro de olho humano → íris vira circuito neural azul, partículas digitais, god rays. |
| 2 | Problema | "Segurança pública, saúde, educação — sistemas exaustos, decisões no escuro." | Cidade cinza em slow-mo, silhuetas, névoa densa, luz volumétrica fria. |
| 3 | Projeto | "Nasce a Tropa Científica. Inteligência artificial a serviço da vida." | Logo emergindo em holograma, azul elétrico, dolly-in épico, laboratório minimalista. |
| 4 | Como funciona | "Dados, pesquisa e IA convergindo em decisões precisas." | Dashboards holográficos flutuantes, mãos de cientista, código projetado no ar, rack focus. |
| 5 | Benefícios | "Mais eficiência policial. Mais saúde preventiva. Mais conhecimento acessível." | Split-screen sutil: viatura + hospital + sala de aula, tracking cinematográfico. |
| 6 | Demonstração | "Da bancada ao campo. Do algoritmo à ação." | Drone FPV sobrevoando laboratório → operação tática noturna, lens flare natural. |
| 7 | Futuro | "Uma nova era de ciência aplicada — feita no Brasil, para o mundo." | Terra vista do espaço, malha de dados azul conectando continentes, orbit shot. |
| 8 | Encerramento + CTA | "Tropa Científica. Ciência que age. Conheça em tropacientifica.com." | Logo final sobre fundo preto, partículas se dissipando, tipografia elegante. |

## Diretrizes visuais globais (aplicadas a todos os prompts)

- Paleta: branco, azul elétrico, preto, cinza.
- Estilo: cinematic documentary, IMAX, Netflix, National Geographic, 8K photoreal.
- Iluminação: volumetric lighting, god rays, soft shadows, atmospheric fog, cinematic contrast.
- Lentes indicadas por cena (24mm grande angular para cidade/terra; 50–85mm para macro/close; teleobjetiva para operação tática).
- Movimentos: dolly-in (c1, c3), slow-mo (c2), rack focus (c4), tracking (c5), FPV (c6), orbit/crane (c7), push-in (c8).
- Regras negativas em todos os prompts: no deformed faces, no broken hands, no artificial eyes, no illegible text, no generic stock look.

## Pipeline técnico (Higgsfield MCP)

```text
1. models_explore(type:'video', goal:'cinematic photoreal 8s clip')
   → escolher modelo (provável: seedance_2_0 para identidade + kling3_0 para multi-shot)
2. Para cada cena 1..8:
   a. generate_image (still de referência 16:9 e 9:16, mesmo prompt base)
   b. generate_video (image-to-video, 8s, com o still como start_image)
   c. generate_audio (voice-over PT-BR da linha de narração)
3. explainer_video:
   - items = [{video: cena_i, audio: voz_i} for i in 1..8]
   - subtitles: {font: 'Inter Bold'} → legendas PT-BR queimadas
   - saída 1: 1080x1920 (9:16)
   - saída 2: 1920x1080 (16:9) — reframe/regenerar stills 16:9
4. (Opcional) upscale_video (topaz, 2160p) nas duas versões finais.
```

Trilha épica sem direitos autorais: gerar via `generate_audio` (modelo música instrumental) como faixa de fundo separada, mixada dentro do `explainer_video` como áudio adicional por bloco, OU usar biblioteca royalty-free indicada ao usuário para colar em edição externa (mais barato). **Decisão pendente — ver questão abaixo.**

## Estimativa de custos

- 16 stills (8 cenas × 2 formatos) via `generate_image`.
- 16 clipes de vídeo (~8s) via `generate_video`.
- 8 voice-overs PT-BR via `generate_audio`.
- 2 montagens finais via `explainer_video` (+0.05 crédito/bloco por legenda = 0.4 crédito extra por versão).
- Upscale opcional: 2 vídeos via Topaz 2160p.

Executo `get_cost:true` antes de cada geração pesada e reporto o total antes de queimar créditos de verdade.

## Entregáveis

- `roteiro_tropa_cientifica.md` — roteiro técnico + storyboard textual + prompts finais por cena.
- `tropa_cientifica_9x16.mp4` — versão vertical pronta para Reels/Shorts/TikTok.
- `tropa_cientifica_16x9.mp4` — versão horizontal pronta para YouTube/Facebook.
- (Opcional) versões 4K upscaladas.

Todos os artefatos salvos em `/mnt/documents/tropa_video/`.

## O que preciso confirmar antes de gerar

1. **Trilha musical**: gerar via Higgsfield (custa créditos e a qualidade musical é limitada) OU deixar sem música e você adiciona uma royalty-free depois em app de edição? Recomendo a 2ª — mais barato e melhor qualidade.
2. **Upscale 4K**: incluir passe Topaz nas duas versões finais? (dobra o custo de vídeo mas entrega 2160p.)
3. **Voz da narração**: masculina grave (padrão documentário Netflix) ou feminina institucional? PT-BR neutro em ambos os casos.

Assim que responder essas 3, começo pelo `models_explore` + preflight de custo e só disparo as gerações após seu OK do orçamento.
