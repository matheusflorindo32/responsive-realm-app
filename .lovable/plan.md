# Rolagem universal do site

## Objetivo
Garantir que todo o conteúdo possa ser percorrido normalmente por toque, mouse, roda e trackpad em celulares, tablets e computadores.

## Alterações
- Remover o bloqueio de cenas fixadas na página inicial, mantendo cada parte no fluxo vertical natural.
- Preservar as animações leves de entrada sem interceptar ou controlar a rolagem.
- Reforçar o comportamento global para toque vertical, rolagem suave do iOS e largura segura sem corte horizontal.
- Ajustar alturas de tela para navegadores móveis com barras dinâmicas.
- Validar a página inicial em tamanhos de celular, iPad e computador, incluindo acesso ao rodapé.

## Detalhes técnicos
- A experiência cinematográfica deixará de usar `pin` e altura fixa no desktop.
- `html`, `body` e a raiz receberão regras compatíveis com navegadores modernos e fallback para Safari.
- Elementos decorativos continuarão sem capturar gestos.
