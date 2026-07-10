# Portões de segurança antes da sincronização

## P0

- [ ] Tornar o vault privado ou separar `jarvis-private` de `jarvis-public-export`.
- [ ] Auditar o histórico do vault para PII e segredos.
- [ ] Remover `.env` do versionamento e revisar todo o histórico do app.
- [ ] Rotacionar qualquer segredo que já tenha sido exposto.
- [ ] Verificar RLS, RPCs e migrations no Supabase de produção.
- [ ] Testar permissões como anon, aluno, editor e admin AAL2.

## P1

- [ ] Escolher Obsidian Sync como sincronização de dispositivos.
- [ ] Desativar o Git automático concorrente no vault vivo.
- [ ] Proteger `main` e exigir PR/CI.
- [ ] Criar CODEOWNERS e regras de arquivos por agente.
- [ ] Separar staging e produção.
- [ ] Testar backup e restauração.
- [ ] Criar observabilidade, reprocessamento e alertas.

## Regra temporária

Enquanto os itens P0 estiverem abertos, o Command Center não importa o vault bruto. Apenas dados operacionais já protegidos no Supabase podem aparecer.
