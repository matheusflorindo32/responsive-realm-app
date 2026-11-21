# Revisão da rolagem suave

## Regra
No PC, a rodinha deve rolar suavemente em todas as páginas; toque, zoom, teclado, listas internas e preferência por movimento reduzido permanecem nativos.

## Telas verificadas
Todas as rotas de `src/App.tsx` e os pontos de rolagem nos arquivos de páginas foram inspecionados. Antes, apenas a home recebia suavização. Agora um controlador compartilhado atende todas as rotas e descarta o movimento pendente ao trocar de página.

| Locais | Resultado e alcance |
| --- | --- |
| `/`, `/sobre-a-tropa`, `/conteudos`, `/projetos-tropa` | Código inspecionado e rodinha testada na prévia. |
| `/matheus`, `/matheus/sobre`, `/matheus/publicacoes`, `/matheus/formacao`, `/matheus/projetos`, `/matheus/experiencia`, `/matheus/contato` | Código inspecionado e rodinha testada. Troca de página retorna ao topo sem movimento residual. |
| `/sobre`, `/publicacoes`, `/formacao`, `/projetos`, `/experiencia`, `/contato`, `/entrar` | Redirecionamentos inspecionados; destinos usam o mesmo controlador. |
| `/certificados`, `/certificado/:code` | Rodinha testada na vitrine e na tela de código inexistente. Autocomplete aberto; lista atual não transbordava, portanto sua rolagem interna não foi exercitada. Foco e `scrollIntoView` preservados. |
| `/login`, `/cadastro`, `/forgot-password`, `/verify-email` | Código e rolagem testados; telas sem conteúdo excedente não precisam rolar. |
| `/reset-password`, `/mfa/setup`, `/mfa/verify`, `/auth/callback`, `/.lovable/oauth/consent` | Código inspecionado; não exercitados com sessão/token válido. Autenticação e MFA não alterados. |
| `/admin/auth`, `/admin/access-pending`, `/admin/mfa/setup`, `/admin/mfa/verify` | Código inspecionado; controlador comum, sem mudanças no acesso. |
| `/admin`, `/admin/hoje`, `/admin/iniciar`, `/admin/projetos`, `/admin/relacionamentos`, `/admin/conteudo`, `/admin/pesquisa`, `/admin/agentes`, `/admin/skills`, `/admin/sistemas`, `/admin/agenda`, `/admin/inbox`, `/admin/vault`, `/admin/metricas`, `/admin/riscos`, `/admin/sync` | Código e layout inspecionados; não exercitados com sessão administrativa/MFA. |
| `/admin/ensino`, `/admin/ensino/trilhas`, `/admin/ensino/cursos`, `/admin/ensino/cursos/:id`, `/admin/ensino/matriculas`, `/admin/ensino/auditoria`, `/admin/ensino/alunos/:userId`, `/admin/ensino/certificados` | Código inspecionado; não exercitados autenticados. |
| `/app`, `/app/curso/:slug`, `/app/perfil`, `/app/certificados` | Código e layout inspecionados; não exercitados com matrícula/sessão de aluno. |
| `/jarvis-preview`, página não encontrada | Rodinha testada na prévia. |

## Áreas construídas de forma diferente
- Menus de Tropa/APOS: fluxo normal e retorno ao topo preservados.
- Menu lateral administrativo e menu móvel: `overflow-y-auto`, preservados pela opção de rolagem interna nativa.
- Cadastro de cursos: janela com altura máxima e rolagem interna, protegida pela exclusão de `role=dialog`.
- Auditoria: painel lateral e metadados; aluno: lista limitada; sincronização: versões em blocos roláveis; aulas: painel lateral. Código inspecionado, rolagem interna nativa preservada, sem testes autenticados.
- Tabelas, ScrollArea, Sidebar e Command: rolagem própria inspecionada e preservada; gestos horizontais não são suavizados.
- Inputs, seletores, edição de texto e diálogos: explicitamente excluídos da interceptação da rodinha.
- Não há tarefa em segundo plano ou função de banco responsável pela rolagem; nenhuma foi alterada.

## Evidência
- 19 endereços públicos testados com navegador Chromium, incluindo roda do mouse e troca de página.
- PageDown e End testados no portfólio.
- Alteração da preferência por movimento reduzido testada durante a sessão: desativa a suavização.
- Celular e iPad emulados no portfólio: controlador desativado, rolagem nativa funcionando.
- Quatro testes automatizados da política de suavização passaram; prévia sem erros de compilação.

## Limites
Não foi verificado em aparelhos físicos, todos os navegadores/marcas, áreas autenticadas em sessão real nem no domínio publicado. A publicação continua necessária para levar o ajuste ao site público. Registros, permissões e configurações de acesso permaneceram intactos.