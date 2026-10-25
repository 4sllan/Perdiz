# Perdiz - Spec-Driven Development

## 1. Objetivo e fontes de verdade

Conduzir o desenvolvimento da Perdiz a partir de requisitos verificáveis,
antes de implementar código. SDD significa **Spec-Driven Development**:
especificar, decidir, planejar, implementar e validar.

- Especificação do produto: [perdiz-especificacao-tecnica.md](../docs%20/specs/perdiz-especificacao-tecnica.md), versão 1.0.
- Processo de desenvolvimento: este arquivo.
- Backlog de execução: [perdiz-tasks.md](../docs%20/tasks/perdiz-tasks.md).
- Decisões arquiteturais: futuros arquivos `docs /adrs/ADR-NNN-titulo.md`.

A pasta existente chama-se `docs `, com espaço no final. Preservar esse
caminho; nos links Markdown, codificar o espaço como `%20`.

A especificação define o comportamento do produto; este documento define
como desenvolvê-lo. Tarefas e ADRs não podem alterar silenciosamente os
requisitos. Em caso de conflito, registrar a divergência e aprovar uma
alteração na especificação antes de implementar a parte afetada.

## 2. Escopo e invariantes

- Entregar exclusivamente um protótipo com saldo e operações fictícios.
- Não implementar pagamentos, Pix, depósitos, saques, blockchain,
  transferências entre usuários ou negociação com dinheiro real.
- Não habilitar operação comercial por variável de ambiente ou flag.
- Usar Nuxt 4, Vue 3, TypeScript, Tailwind CSS 4, Supabase e PostgreSQL conforme a especificação.
- Manter banco/servidor como fonte de verdade de preços, saldos e posições.
- Preservar atomicidade, idempotência, precisão decimal e auditoria.
- Aplicar autorização server-side, RLS e separação de dados públicos/privados.
- Nunca expor `service_role`, credenciais ou dados pessoais em canais públicos.
- Suportar `br`, `us`, `pt` e `es`, sem confundir locale com elegibilidade regional.
- Não ativar negociação multirresultado no MVP; preparar apenas a modelagem.

As exigências comerciais da seção 15 são bloqueios de um projeto futuro,
não tarefas de implementação deste protótipo.

## 3. Fluxo por incremento

1. **Especificar:** identificar seções de origem, comportamento esperado,
   invariantes, erros e cenários de teste. Registrar lacunas sem inventar regras.
2. **Decidir:** criar ADRs para escolhas pendentes; obter aceite do responsável
   pelo produto/arquitetura antes de implementar o comportamento afetado.
3. **Planejar:** criar tarefa com entregáveis, dependências e aceite observável.
   Dividir tarefas grandes sem perder a rastreabilidade.
4. **Implementar:** trabalhar em um incremento coeso, seguindo a arquitetura
   existente e incluindo migrações, autorização e testes necessários.
5. **Validar:** executar os testes do incremento e a regressão aplicável;
   revisar segurança, integridade, acessibilidade e localização.
6. **Registrar:** atualizar status e evidências no backlog, incluindo limitações,
   decisões e documentação alterada. Só então iniciar o próximo incremento.

Executar por dependências, não apenas pela ordem numérica. Trabalho
independente pode avançar enquanto uma decisão bloqueia outro módulo.
Não iniciar código crítico sob uma hipótese ainda não aprovada.

## 4. Decisões arquiteturais

As 12 decisões da seção 16 devem gerar ADRs curtos e versionados.
Criar os arquivos quando as decisões forem trabalhadas; não registrar
decisões como aceitas apenas para desbloquear o planejamento.

Cada ADR deve conter:

- ID, título, data e estado: `proposto`, `aceito` ou `substituído`.
- Contexto, seções da especificação e tarefas afetadas.
- Alternativas, decisão proposta e consequências.
- Impactos em integridade, segurança, testes e migrações.
- Responsável e evidência/data do aceite; referência ao sucessor, se houver.

Regras adicionais não definidas na especificação também exigem decisão
documentada quando alterarem o domínio, permissões ou garantias de segurança.
Protótipos exploratórios não substituem aceite de uma regra de negócio.

## 5. Contrato das tarefas

Usar IDs estáveis `PDZ-NNN`. Não reutilizar IDs removidos; registrar o motivo
de cancelamento. Usar uma única ficha por tarefa, evitando cópias divergentes.

```md
### PDZ-NNN - Título orientado a resultado

- Status: pendente
- Fase: N - Nome
- Origem: seções X, Y da especificação v1.0.
- Dependências: PDZ-NNN; ADR-NNN aceito, quando aplicável.
- Entregáveis: código, contratos, migrações e documentação esperados.
- Aceite: condições observáveis que demonstram o comportamento.
- Testes: cenários e nível de teste; incluir rejeições e falhas relevantes.
- Evidências: a preencher na execução.
```

Estados permitidos:

- `pendente`: planejada, ainda não iniciada; verificar dependências antes de iniciar.
- `em andamento`: execução iniciada e pré-condições atendidas.
- `bloqueada`: execução impedida; registrar motivo e condição de desbloqueio.
- `concluída`: todos os critérios atendidos e evidências registradas.
- `cancelada`: retirada explicitamente, com justificativa e impacto documentados.

Uma dependência pendente não significa que a tarefa já foi executada ou
formalmente bloqueada. No backlog inicial, todas as tarefas ficam pendentes.
Ao iniciar um ciclo, selecionar uma tarefa elegível e registrar impedimentos.

## 6. Definition of Ready

Antes de iniciar uma tarefa:

- Identificar as seções de origem e ter aceite testável e escopo delimitado.
- Concluir dependências e obter aceite dos ADRs exigidos.
- Definir contratos de entrada/saída e erros quando houver API.
- Identificar dados, autorização, migrações e invariantes afetados.
- Ter estratégia de teste, dados fictícios e ambiente seguro disponíveis.

## 7. Definition of Done

Uma tarefa só está concluída quando:

- Os entregáveis e critérios de aceite estão implementados e revisados.
- Testes relevantes passam; cenários negativos e regressões estão cobertos.
- Lint, verificação de tipos e build passam quando houver código aplicável.
- Migrações são versionadas e testadas em banco local limpo, quando aplicável.
- RLS e permissões são testadas com identidades reais de teste, não somente
  com credenciais privilegiadas que contornam as políticas.
- Operações críticas preservam atomicidade, idempotência e auditoria.
- UI aplicável funciona nos quatro locales, em mobile e desktop, com teclado.
- Nenhum segredo ou recurso de dinheiro real é introduzido.
- Backlog, contratos e ADRs refletem a implementação.
- Evidências identificam arquivos/testes, comandos, resultados e limitações.

Tarefas exclusivamente documentais são validadas por consistência,
rastreabilidade e revisão; não precisam executar um build inexistente.
Não marcar como concluído algo apenas descrito, simulado por mock ou não testado.

## 8. Validação e mudanças

Usar Vitest para unidades/componentes, testes de integração com PostgreSQL e
Supabase locais para integridade/RLS e Playwright para jornadas E2E.
Definir os comandos reais na fundação; não presumir scripts já existentes.
Testes de UI não substituem testes transacionais e de concorrência.

Cada mudança de escopo deve atualizar primeiro a especificação e, depois,
ADRs, tarefas e testes afetados. Preservar os IDs existentes e indicar
requisitos substituídos. Nunca renomear diretórios ou descartar alterações
preexistentes como efeito colateral.

A saída de cada fase deve satisfazer seu critério na seção 13 da
especificação. A entrega final deve atender à seção 14 e permanecer
restrita à demonstração controlada, sem abertura pública irrestrita.
