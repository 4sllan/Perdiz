# SDD para Devin - Perdiz

## Objetivo e ativação

Este documento define o processo de Spec-Driven Development (SDD) do
projeto Perdiz, não o comportamento do produto. Os requisitos do produto
vivem na especificação e no backlog sob `docs /`.

Para ativar, peça ao Devin:

> Leia .devin/sdd.md e siga o fluxo SDD para: <objetivo>.

Não presuma que um Markdown em `.devin/` seja carregado automaticamente.
As fases podem ser solicitadas em linguagem natural.

- Aplique este fluxo quando o usuário pedir SDD ou referenciar este documento.
- Para uma funcionalidade complexa sem pedido de SDD, recomende o fluxo, mas
  não imponha novas aprovações a uma tarefa já autorizada.
- Respeite as instruções de maior prioridade e o escopo solicitado pelo usuário.
- Responda em português, salvo pedido contrário.

## Contrato de execução

Sequência: **análise -> aprovação -> spec -> aprovação -> tasks -> aprovação ->
uma task -> validação -> aprovação da próxima task**.

1. Não avance de fase nem comece a próxima task sem autorização explícita.
2. A aprovação vale apenas para a transição ou task identificada. Perguntas,
   comentários e silêncio não são aprovação. Um "pode continuar" só vale
   quando existe exatamente um próximo passo apresentado e inequívoco.
3. Se o usuário pedir várias fases de uma vez, explique os gates e realize
   apenas a primeira fase pendente. Para mudar este contrato, exija um pedido
   explícito de alteração do fluxo, não uma autorização genérica.
4. Dentro da fase/task autorizada, trabalhe com autonomia: investigue,
   implemente, teste e corrija problemas do próprio escopo sem pedir
   aprovação a cada comando.
5. Não confunda aprovação de fase com permissão para operações destrutivas,
   acesso à rede, instalação de dependências, elevação de privilégios ou
   efeitos externos; solicite as permissões adicionais exigidas pelo ambiente.
6. Não amplie o escopo para refatorações, novas dependências ou melhorias
   adjacentes. Se uma mudança de contrato, arquitetura ou requisito for
   necessária, pare e proponha revisão da spec e das tasks antes de
   implementar.
7. Não declare uma task validada se testes falharam, não foram executados ou
   se critérios obrigatórios ainda dependem de verificação manual. Quando a
   execução de testes estiver adiada por orientação do responsável, mantenha
   a task como `aguardando validação`, nunca `concluída`.
8. Decisões de domínio cobertas por ADR planejado (seção 16 da especificação)
   não são tomadas por conveniência de implementação: task que depende de
   ADR não aceito permanece bloqueada até o aceite explícito do responsável.

## Fontes e mapa do projeto

Use o código atual como evidência do comportamento existente; use a spec e
os ADRs aceitos como referência do comportamento desejado. Relate
divergências em vez de alterar um dos dois silenciosamente.

Leia `README.md`, `package.json`, a especificação, o backlog e somente os
módulos pertinentes. Confirme caminhos, versões e scripts no repositório;
este mapa não substitui inspeção.

ATENÇÃO: o diretório de documentação é `"docs "`, **com espaço final no nome**.
Preserve o caminho, cite-o entre aspas no terminal (`ls "docs /specs"`) e
não o "corrija" — `README.md` e `.prettierignore` dependem dele.

| Área | Pontos de entrada |
| --- | --- |
| App Nuxt 4 + Vue 3 | `app/app.vue`, `app/pages/` (rotas por arquivo) |
| Estilos | `app/assets/css/main.css` — Tailwind CSS 4 via `@tailwindcss/vite`, tokens em `@theme`; não existe `tailwind.config.js` nem módulo `@nuxtjs/tailwindcss` |
| Módulos Nuxt | `@nuxt/fonts` (fontes otimizadas) e `@nuxt/icon` (ícones Iconify, bundle local com `@iconify-json/lucide`), registrados em `nuxt.config.ts` |
| Código compartilhado | `shared/` — importado como `#shared/...` no app; testes unitários usam caminho relativo (`../../shared/...`) |
| Configuração | `nuxt.config.ts`, `tsconfig.json` (referencia projetos gerados em `.nuxt/`), `tsconfig.tools.json` (testes e configs de ferramenta), `eslint.config.mjs` (flat config), `.prettierrc.json` |
| Testes unitários | `tests/unit/**/*.test.ts`, Vitest (`vitest.config.ts`), ambiente `node`; `@nuxt/test-utils` instalado para futuros testes com runtime Nuxt, ainda não configurado |
| Testes E2E | `tests/e2e/`, Playwright (`playwright.config.ts`); sobe `pnpm dev --port 3100` próprio, `baseURL` 3100, projetos `chromium` e `mobile-chromium` |
| Especificação e backlog | `docs /specs/perdiz-especificacao-tecnica.md`, `docs /tasks/perdiz-tasks.md` |
| Gerado, não versionar | `.nuxt/`, `.output/`, `node_modules/` — o pós-install `nuxt prepare` recria `.nuxt/` (tipos e tsconfig do projeto) |

Supabase/PostgreSQL, autenticação, i18n (`/br/`, `/us/`, `/pt/`, `/es/`),
mercados, livro de ordens e realtime são planejados na especificação, mas
**ainda não implementados**. Trate-os como escopo futuro descrito em spec e
ADR, não como código existente.

### Invariantes a verificar quando afetados

- Simulação explícita: a Perdiz é um protótipo com dinheiro fictício. Não
  implemente depósitos, saques, Pix, transferências entre usuários, saldo
  resgatável ou integração de pagamento. Preserve avisos de demonstração
  (`shared/constants/simulation.ts`) em superfícies novas.
- Fonte de verdade no servidor: preços, saldos, ordens, negociações e
  liquidações nunca são confiados ao cliente. Quando o backend existir,
  valide e autorize no servidor, não apenas na UI.
- Consistência e idempotência: operações que alteram saldo ou posição devem
  ser atômicas, auditáveis e idempotentes a reenvios.
- Internacionalização real: idioma, país, moeda de exibição e elegibilidade
  são conceitos distintos; locale não define permissão. Não concatene
  gramaticalmente nem use moeda de exibição como conversão de saldo.
- Acessibilidade: navegação por teclado, foco visível, contraste, skip link
  e estados de loading/erro/vazio; respeitar `motion-reduce`.
- Toolchain fixa: Node 24.18.1 (`.nvmrc`, `engines`), pnpm 11.18.0
  (`packageManager`, `engine-strict`, `save-exact`, `--frozen-lockfile`).
  Prefira versões publicadas há pelo menos 7 dias ao adicionar dependências.
- Estilo de código: Prettier sem ponto e vírgula, aspas simples,
  `trailingComma: all`, `printWidth` 100; `prettier-plugin-tailwindcss`
  ordena classes Tailwind ao formatar. ESLint flat config em
  `eslint.config.mjs` sobre `@nuxt/eslint-config`; o módulo `@nuxt/eslint`
  não está instalado, então `.nuxt/eslint.config.mjs` não é regerado pelo
  `nuxt prepare` — a variante `withNuxt` depende desse arquivo gerado.
  `docs /` e `.devin/` estão no `.prettierignore` — `pnpm format` não deve
  reformatá-los.

## Fase 1 - Analisar

Permitido: leitura e inspeção local sem alterar o projeto. Não criar spec,
tasks, relatórios em arquivo, código, configurações ou dependências nesta
fase. Evite iniciar `pnpm dev` ou `pnpm build` só para "olhar" o app — o dev
server reescreve `.nuxt/`; prefira inspeção estática.

1. Confira `git status --short` e preserve alterações preexistentes.
2. Entenda objetivo, usuários, resultado esperado e limites. Pergunte apenas
   quando uma indefinição impedir uma recomendação segura; registre suposições.
3. Trace o fluxo relevante — página/componente, `shared/`, server routes do
   Nuxt (quando existirem) — e identifique implementação completa, parcial e
   oportunidades de reutilização.
4. Confira requisitos (`RF`/`RNF`), critérios de aceite (`CA`), ADRs
   aplicáveis, modelos de dados e testes existentes na especificação.
5. Identifique riscos, divergências de documentação e lacunas de validação.
   Cite arquivos e trechos concretos; diferencie fato observado de hipótese.
6. Recomende uma abordagem de alto nível, sem implementar nem antecipar uma
   especificação detalhada.

Entregue no chat:

- Contexto atual e objetivo.
- Implementação existente e evidências.
- Reutilização e impacto arquitetural.
- Riscos, suposições e perguntas bloqueantes.
- Recomendação e escopo proposto.

Encerre informando: "Análise concluída. Nenhum arquivo foi criado ou
alterado. Aguardando autorização para criar a spec."

## Fase 2 - Especificar

Pré-condição: análise concluída e autorização para criar a spec.
Crie apenas `docs /specs/<slug>.md`, com slug descritivo em kebab-case. Se o
arquivo já existir, leia e revise sem apagar decisões ou trabalho alheio.
Para incrementos que alterem a especificação principal
(`perdiz-especificacao-tecnica.md`), proponha a revisão na própria spec em
vez de criar documento paralelo que conflite com ela.

A spec deve conter:

1. Status (`em revisão`), objetivo, contexto, escopo e fora de escopo.
2. Regras de negócio e requisitos identificados (`RF-01`, `RNF-01`),
   rastreáveis à especificação principal quando houver.
3. Locales e plataformas afetados (`br`/`us`/`pt`/`es`, desktop/tablet/mobile)
   e comportamento de UI/UX, incluindo avisos de simulação.
4. Contratos afetados: rotas de API/Nitro, erros, realtime, schemas tipados e
   eventos, com exemplos de payload quando necessário; compatibilidade e
   versionamento; convenção de `request_id` e erros sanitizados.
5. Estado, persistência e migrações versionadas (Supabase/PostgreSQL, quando
   aplicável), incluindo integridade e preservação dos dados.
6. Autenticação, autorização (RLS), validação no servidor, privacidade e
   limites de recursos.
7. Falhas e recuperação: offline, timeout, reconexão, idempotência e
   conflitos, se aplicáveis.
8. Critérios de aceite verificáveis (`CA-01`), ligados aos requisitos.
9. Estratégia de testes automatizados/manuais, riscos e decisões em aberto —
   registre ADRs necessários com bloqueios explícitos.

Marque seções sem impacto como "não se aplica" com justificativa curta. Não
invente endpoints, tabelas ou infraestrutura para preencher o template.
Não crie a lista de tasks nem altere implementação.

Encerre com o caminho da spec, pontos que exigem decisão (incluindo ADRs) e:
"Aguardando aprovação da spec para criar as tasks."

## Fase 3 - Planejar tasks

Pré-condição: spec aprovada explicitamente, sem decisões bloqueantes
pendentes (ADRs exigidos aceitos ou registrados como bloqueio). Registre a
aprovação no status da spec, sem atribuir aprovações não recebidas.

O backlog do projeto fica em `docs /tasks/`. Para incrementos do backlog
principal, atualize `perdiz-tasks.md` mantendo a numeração `PDZ-XXX`, fases e
o formato de ficha existentes; para um plano derivado de spec nova, crie
`docs /tasks/<slug>-tasks.md` referenciando a spec aprovada.

Inclua status geral, ordem de execução e, para cada task:

```markdown
## T1 - <resultado observável>
- Status: pendente
- Requisitos/aceite: RF-01, CA-01
- Dependências: nenhuma (tasks e ADRs exigidos)
- Escopo e arquivos prováveis: ...
- Implementação: ...
- Testes e comandos de validação: ...
- Critério de conclusão: ...
- Evidências: a preencher durante a execução
```

Prefira tasks pequenas e verificáveis. Inclua testes de regressão junto da
mudança que eles protegem; não adie toda a cobertura para a última task.
Inclua documentação, traduções nos quatro catálogos e validação integrada
quando pertinentes. Não execute tasks nesta fase.

Encerre com o caminho do plano e:
"Aguardando aprovação das tasks e autorização para executar T1."

## Fase 4 - Executar uma task

Pré-condição: plano aprovado e task específica autorizada, com dependências
(tasks e ADRs) concluídas. "Próxima task" significa a primeira pendente com
dependências satisfeitas; se houver ambiguidade entre planos, confirme qual
é o correto.

1. Releia spec, task, status e diff atual. Não presuma que o contexto
   anterior ainda representa o repositório.
2. Marque a task como `em andamento` e implemente apenas seu escopo, com a
   menor mudança suficiente e seguindo os padrões existentes.
3. Adicione/ajuste testes de regressão e execute as validações pertinentes.
   Corrija falhas causadas pela task; reporte falhas preexistentes
   separadamente.
4. Revise o diff, inclusive segredos acidentais, alterações fora de escopo e
   arquivos gerados (`.nuxt/`, `.output/`). Não reverta alterações que não
   sejam suas.
5. Atualize o plano com arquivos alterados, comandos, resultados, critérios
   atendidos e pendências. Atualize `README.md` e a especificação se fizer
   parte da task.
6. Use `concluída` somente com todos os critérios atendidos; caso contrário,
   use `aguardando validação` ou `bloqueada` e explique o que falta.
7. Pare. Não inicie a task seguinte, não faça commit, push ou publicação sem
   pedido.

No retorno, informe: task e status; mudança realizada; validações e
resultados; limitações; próxima task elegível. Solicite autorização somente
para esse próximo passo. Na última task, informe a conclusão do plano ou
pendências, sem inventar outra etapa obrigatória.

### Validação na Perdiz

Execute os comandos a partir da raiz, conforme o impacto da task:

| Comando | Cobertura |
| --- | --- |
| `pnpm lint` | ESLint flat config (`eslint.config.mjs`); o script roda `eslint . --fix` e reescreve arquivos — revise o diff depois de executar |
| `pnpm format:check` | Formatação Prettier; ordena classes Tailwind via `prettier-plugin-tailwindcss`; `docs /` e `.devin/` são ignorados |
| `pnpm typecheck` | `nuxt typecheck` (vue-tsc, strict) + `tsc -p tsconfig.tools.json` (testes e configs) |
| `pnpm test` | Vitest, unitários em `tests/unit/` |
| `pnpm test:e2e:install` | Baixa o Chromium do Playwright (acesso à rede) |
| `pnpm test:e2e` | Smoke SSR e navegação; sobe servidor próprio na porta 3100 |
| `pnpm build` | Build de produção Nuxt/Nitro em `.output/` |
| `pnpm dev` | Dev server em `http://localhost:3000` (host padrão do Nuxt; `dev` e `preview` não fixam mais `--host 127.0.0.1`) |
| `git diff --check` | Erros de whitespace no diff rastreado |

Runtime fixo: Node.js 24.18.1 (`nvm use`) e pnpm 11.18.0. Reinstale com
`pnpm install --frozen-lockfile`; nunca edite `pnpm-lock.yaml` à mão nem use
npm/yarn. O pós-install `nuxt prepare` é pré-requisito do typecheck (gera os
projetos de `.nuxt/` referenciados pelo `tsconfig.json`).

Na fundação (PDZ-001), a execução de testes foi adiada por orientação do
responsável: suites ficam configuradas, mas só rodam quando autorizadas.
Confirme a orientação vigente antes de executar `pnpm test`/`pnpm test:e2e`;
se ainda vedada, registre a validação como pendente em vez de presumir
resultado.

Não instale pacotes nem baixe navegadores automaticamente se isso exigir
acesso à rede ou mudar o escopo aprovado. Para tarefas apenas documentais,
revise caminhos (incluindo o espaço em `docs /`), comandos, coerência e diff;
suites de runtime não são obrigatórias.

Para UI, i18n e, futuramente, realtime/WebSocket, descreva o roteiro manual e
registre o que foi realmente observado — viewport, locale, estados de erro.
Separe resultado automatizado de teste manual pendente. Se um comando não
puder ser executado, informe o motivo e o impacto na validação.

## Segurança, retomada e documentação

- Não leia nem reproduza `.env`, tokens, cookies, chaves ou dados de usuários
  sem necessidade e autorização. Prefira `.env.example` e nomes de variáveis.
  Segredos e service keys nunca vão para o cliente — mesmo em protótipo.
- Testes usam dados descartáveis e isolados. Quando Supabase e banco existirem,
  nunca rode migrações ou seeds contra dados reais para "validar" uma task;
  isole com fixtures e ambientes de teste próprios.
- Em retomadas, leia spec/plano e procure a aprovação explícita no contexto
  disponível. Status no arquivo sozinho não prova autorização — em
  particular, `em andamento` no backlog não é gate vencido. Se não for
  possível confirmar o gate, peça confirmação apenas do próximo passo.
- Uma revisão substantiva de requisito ou de ADR invalida a aprovação do
  trecho afetado: apresente o impacto e obtenha nova aprovação antes de
  executar.
- Specs guardam requisitos e decisões; ADRs guardam decisões de domínio
  aceitas; o backlog guarda status e evidências; `README.md` guarda
  comportamento, configuração e limites do produto. Não coloque mensagens de
  "aguardando autorização" na documentação do produto.
- Este arquivo é a referência do processo SDD quando invocado no Devin.
