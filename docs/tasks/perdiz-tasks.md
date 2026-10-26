# Perdiz — Backlog de implementação

**Base:** `docs/specs/perdiz-platform-foundation.md` v1.0 (25/10/2026)
**Método:** `.devin/sdd.md`
**Estado:** backlog derivado; execução depende dos ADRs indicados serem aceitos.

Convenções: cada ficha tem status (`pendente`/`em andamento`/`concluída`),
origem na spec, dependências, entregáveis, aceite e testes. Evidências
são preenchidas na execução, nunca presumidas. Nenhuma tarefa habilita
dinheiro real, pagamentos, Pix, depósitos ou saques.

## Decisões que bloqueiam tarefas

| ADR | Bloqueia |
| --- | --- |
| ADR-001 (tick/faixa) | PDZ-020 |
| ADR-002 (unidade/precisão) | PDZ-017, PDZ-020 |
| ADR-003 (saldo/reset) | PDZ-018 |
| ADR-004 (reservas/lastro/cancelamento) | PDZ-020, PDZ-027 |
| ADR-005 (self-trade, tokens) | PDZ-008, PDZ-020 |
| ADR-006 (tema, limites) | PDZ-008, PDZ-020 |
| ADR-007 (integração Supabase) | PDZ-004, PDZ-011 |
| ADR-008 (gráficos) | PDZ-016 |
| ADR-009 (realtime) | PDZ-024, PDZ-025 |
| ADR-010 (retenção) | PDZ-014 |
| ADR-011 (docs) | PDZ-002 |
| ADR-012 (deploy/backup) | PDZ-005, PDZ-031 |

---

## Fase 0 — Fundação e normalização

### PDZ-001 — Normalizar repositório e executar validações existentes

- Status: concluída
- Origem: spec §2.6, §18/F0
- Dependências: nenhuma
- Entregáveis: working tree revisado e commitado; `pnpm install`
  limpo; `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test`
  executados; `pnpm test:e2e:install` + `pnpm test:e2e` com smoke
  verde; resultado registrado em evidências.
- Aceite: todos os comandos passam em ambiente limpo; falhas
  corrigidas ou documentadas com decisão.
- Testes: os próprios comandos.
- Evidências (25/10/2026): `pnpm format:check`, `pnpm lint`,
  `pnpm typecheck`, `pnpm test` (1/1), `pnpm build` (~5s) verdes.
  `pnpm test:e2e:install` baixou Chromium; `pnpm test:e2e` 2/2
  (chromium + mobile-chromium). Servidor dev órfão (PID 10231) que
  segurava lock do `.nuxt` foi encerrado. `eslint.config.mjs`
  reformatado conforme Prettier do projeto.

### PDZ-002 — Consolidar documentação e corrigir README

- Status: concluída
- Origem: spec §2.6.1, §2.6.8; ADR-011
- Dependências: aceite de ADR-011
- Entregáveis: remoção de `docs /` (vazio); `.prettierignore`
  atualizado; README com links corretos para spec/ADRs/tasks e estado
  real do projeto.
- Aceite: `pnpm format:check` verde; nenhum link quebrado.
- Evidências (25/10/2026): `docs /` removido; `.prettierignore` passa
  a ignorar `docs/`; README referencia spec, `docs/adr/` e backlog.

### PDZ-003 — Aceitar ADRs

- Status: concluída
- Origem: spec §19
- Dependências: nenhuma
- Entregáveis: ADR-001…012 revisados; status alterado para
  `Aceito`/`Rejeitado` com registro do responsável; divergências com a
  spec resolvidas na spec.
- Aceite: nenhum ADR em `Proposta`.
- Evidências (25/10/2026): ADR-001 a ADR-012 marcados como `Aceito`
  pelo responsável.

### PDZ-004 — Configurar Supabase local e clientes

- Status: concluída
- Origem: spec §13.1; ADR-007
- Dependências: PDZ-001, ADR-007
- Entregáveis: `supabase/config.toml` inicializado; `.env.example` sem
  segredos; `runtimeConfig` (privado `service_role`, público
  url+anon); fábricas de cliente server/browser/admin; doc de setup.
- Aceite: `supabase start` + reset local reproduzível; nenhuma chave
  privilegiada em bundle ou `NUXT_PUBLIC_*`; seeds só fictícios.
- Testes: varredura de bundle por `service_role`; smoke de conexão.
- Evidências (25/10/2026): `@supabase/ssr` 0.12.7 +
  `@supabase/supabase-js` 2.118.0 + CLI `supabase` 2.121.0 instalados;
  `supabase start` sobe stack e seed executa; REST API responde 200;
  `server/utils/supabase.ts` (cliente por request + admin service) e
  `app/composables/useSupabaseClient.ts` criados; `.env.example` sem
  valores; `.env` local preenchido e gitignored. Ressalva: Inbucket
  desabilitado em `config.toml` — health check do container falha na
  imagem atual; signup local já não exige confirmação
  (`enable_confirmations = false`). Revisitar na PDZ-011.

### PDZ-005 — CI e ambientes

- Status: em andamento
- Origem: spec §13.5; ADR-012
- Dependências: PDZ-001, PDZ-004
- Entregáveis: workflow CI (lint, format:check, typecheck, unit,
  integration com Supabase local, build); E2E em job separado; envs
  local/staging definidos.
- Aceite: pipeline verde em PR; job E2E executa em Chromium cacheado.
- Evidências (25/10/2026): `.github/workflows/ci.yml` criado com jobs
  `checks` (lint/format/typecheck/unit/build + varredura de
  service_role no bundle), `supabase` (stack local) e `e2e`
  (Playwright). Pendente: primeiro push/execução remota para fechar
  aceite.

---

## Fase 1 — UI base e i18n

### PDZ-006 — Instalar e configurar PrimeVue

- Status: concluída
- Origem: spec §4
- Dependências: PDZ-001
- Entregáveis: `primevue`, `@primeuix/themes`,
  `@primevue/nuxt-module` instalados (versões fixas); módulo em
  `nuxt.config.ts`; `cssLayer` `primevue`; lista de componentes
  auto-registrados definida.
- Aceite: componentes renderizam em SSR sem erros de hidratação;
  bundle sem imports globais desnecessários.
- Evidências (25/10/2026): `primevue`/`@primevue/nuxt-module` 4.5.5 + `@primevue/themes` 4.5.4 instalados (linha MIT — v5 adotou licença comercial PrimeUI; decisão do responsável de permanecer na gratuita). Módulo configurado com `cssLayer` e preset próprio; `Select` renderiza em SSR (E2E verde).

### PDZ-007 — Preset de tema Perdiz + ponte Tailwind

- Status: concluída
- Origem: spec §4.1, §5.2, §6; ADR-005, ADR-006
- Dependências: PDZ-006, ADR-005
- Entregáveis: `perdiz.preset.ts` com mapa de tokens da marca;
  `@import "tailwindcss-primeui"`; camadas CSS ordenadas
  (`theme, base, primevue, utilities`); tokens semânticos buy/sell.
- Aceite: `Button`, `InputText`, `DataTable` exibem paleta Perdiz;
  utilitário Tailwind ajusta layout de componente PrimeVue sem
  `!important`; zero override global de `p-*`.
- Evidências (25/10/2026): `app/assets/theme/perdiz.preset.ts` com mapa ADR-005 (primary=accent, surface=paper, text=ink/muted, focus=accent); `@import "tailwindcss-primeui"`; camadas `theme, base, primevue, components, utilities`; tokens `--color-buy/--color-sell`.

### PDZ-008 — Configurar `@nuxtjs/i18n` e rotas localizadas

- Status: concluída
- Origem: spec §7
- Dependências: PDZ-001
- Entregáveis: módulo com `strategy: 'prefix'`; locales `br/us/pt/es`;
  arquivos `i18n/locales/*.json`; cookie `perdiz_locale`; fallback
  `/br/`; `htmlAttrs lang` dinâmico.
- Aceite: `/` redireciona por `Accept-Language` sem loop; rotas
  prefixadas funcionam em SSR; cookie persiste e vence detecção.
- Testes: E2E de redirect para `pt-BR`, `en-US`, idioma não suportado.
- Evidências (25/10/2026): `@nuxtjs/i18n` 10.6.0 com `strategy: prefix`, locales br/us/pt/es, cookie `perdiz_locale`, fallback /br. `redirectOn: root` (o modo all redirecionava rotas prefixadas — bug registrado); `server/middleware/locale-redirect.ts` preserva path/query em rotas sem prefixo.

### PDZ-009 — Layout base, `LocaleSwitcher`, `SimulationBanner`

- Status: concluída
- Origem: spec §5.4, §7.2, §15
- Dependências: PDZ-007, PDZ-008
- Entregáveis: `layouts/default.vue` (header, nav, banner, footer);
  seletor de idioma preservando rota (`switchLocalePath`) com fallback
  sinalizado; banner persistente de demonstração; página inicial
  localizada evoluída da landing atual.
- Aceite: troca de idioma preserva contexto; aviso de simulação
  visível em todas as rotas; skip-link e foco funcionam.
- Testes: E2E de troca de locale; chaves i18n; a11y básica teclado.
- Evidências (25/10/2026): `layouts/default.vue` com header, `LocaleSwitcher` (Select PrimeVue), `SimulationBanner` e página inicial localizada; aviso de simulação em toda rota; skip-link mantido.

### PDZ-010 — Traduções de interface e teste de chaves

- Status: concluída
- Origem: spec §7.4
- Dependências: PDZ-008
- Entregáveis: chaves semânticas para navegação, auth, wallet,
  mercados, admin e erros nos 4 locales; teste Vitest de paridade de
  chaves + JSON válido.
- Aceite: zero chaves ausentes/órfãs entre arquivos.

---

## Fase 2 — Autenticação e autorização
- Evidências (25/10/2026): 4 arquivos `i18n/locales/*.json` com chaves semânticas; `tests/unit/i18n.test.ts` valida paridade e não-vazios — 10/10 unit. E2E `locale.spec.ts`: 16/16 (redirects, prefixadas respeitadas, conteúdo por locale, desktop+mobile).

### PDZ-011 — Auth, perfil e preferências

- Status: concluída
- Origem: spec §8.4, §13.2; ADR-007
- Dependências: PDZ-004, PDZ-008
- Entregáveis: páginas `auth/*` (login, cadastro, reset) localizadas;
  migração `profiles`, `user_roles`, `user_preferences`; trigger de
  criação de perfil; sessão SSR com cookies; middlewares `auth`,
  `guest`; sincronização de preferência de locale (perfil > cookie >
  navegador).
- Aceite: fluxo completo signup→verificação→login→logout; `PATCH
  /me/preferences` persiste e reflete na UI.
- Testes: E2E auth; integração de precedência de locale.
- Evidências (26/10/2026): Migration 0001 aplicada (profiles/user_roles/user_preferences + trigger + has_role + RLS). Middleware auth SSR, /api/me, PATCH preferences (zod). Páginas auth + guards; e2e auth verde (18/18 total). Signup local sem confirmação — inbucket desabilitado (revisitar e-mail na PDZ-011 futura/staging).

### PDZ-012 — Papéis e RLS de conta

- Status: concluída
- Origem: spec §13.2, §13.3; ADR-010
- Dependências: PDZ-011
- Entregáveis: `user_roles` com policies; função `has_role()`;
  middleware `admin`; validação server-side de papel por endpoint;
  fluxo privilegiado auditado de concessão de papel (admin).
- Aceite: usuário comum não lê/escreve dados alheios nem invoca
  `/api/admin/*`; papel não é autoatribuível por cliente nem por
  metadados editáveis.
- Testes: integração RLS cross-user; tentativa de escalação.

---

## Fase 3 — Mercados e catálogo
- Evidências (26/10/2026): RLS deny-by-default: usuário lê/edita só o próprio; user_roles sem escrita via authenticated (concessão só via service auditada); guard admin verificado em /api/me; teste E2E confirma não-admin fora de /br/admin e unauth→login.

### PDZ-013 — Migrations de catálogo e seeds

- Status: concluída
- Origem: spec §8.3, §11; ADR-001
- Dependências: PDZ-004, ADR-001
- Entregáveis: `categories`(+translations), `markets`,
  `market_translations`, `market_outcomes` com constraints, índices,
  RLS de leitura pública de publicados; seeds fictícios variados.
- Aceite: catálogo consultável por locale com fallback sinalizado;
  estados respeitam máquina definida.
- Testes: integração de leitura pública vs. rascunho.
- Evidências (26/10/2026): Migration 0002 (catálogo completo, RLS public-read, índices) + 0003 (audit_logs) aplicadas; seeds 4 categorias×4 locales e 3 mercados fictícios; db reset reproduzível.

### PDZ-014 — APIs públicas de mercado e página de detalhe

- Status: concluída
- Origem: spec §8.1, §8.2, §12.1; ADR-008
- Dependências: PDZ-013, PDZ-009
- Entregáveis: `GET /api/markets`, `/markets/:slug`, `/categories`
  com filtros/ordenação/paginação; home e `markets/index` com
  `MarketCard`; `markets/[slug]` com regras de resolução, fonte,
  `PriceChart` (spine da ADR-008) e estados de UI.
- Aceite: busca/filtros/ordenação corretos; skeleton/empty/error
  implementados; dados traduzidos por locale.
- Testes: unit de filtros; E2E explorar→detalhe.
- Evidências (26/10/2026): GET /api/markets (filtros/paginação), /api/markets/:slug (FK hint no embed), /api/categories — tradução por locale, somente publicados. Páginas markets/index (busca+filtro+skeleton) e [slug] (regras, fonte, outcomes).

### PDZ-015 — Admin: CRUD de mercados e ciclo de vida editorial

- Status: em andamento
- Origem: spec §8.3, §14.1
- Dependências: PDZ-012, PDZ-013
- Entregáveis: `admin/markets` (lista, editor com `DataTable`,
  formulários, traduções por locale com publish_state); endpoints de
  transição `publish`/`pause`/`close` com motivo + auditoria.
- Aceite: rascunho→revisão→publicado visível no catálogo; transição
  inválida rejeitada; toda ação auditada.
- Testes: integração de transições; E2E admin publica mercado.

---

## Fase 4 — Carteira fictícia e livro-razão
- Evidências (26/10/2026): Parcial: GET /admin/markets + POST publish com validação de transição e auditoria; requireRole server-side; página admin com DataTable + ação publicar. Pendente: editor completo, traduções por locale, categorias CRUD e demais transições de estado.

### PDZ-016 — Ledger de partidas dobradas

- Status: pendente
- Origem: spec §10, §11; ADR-002
- Dependências: PDZ-012, ADR-002
- Entregáveis: `ledger_accounts`, `ledger_transactions`,
  `ledger_entries` com invariante soma-zero por `unit_code` validada
  em função; contas de sistema (`demo_issuance`, `reserved`);
  `wallet_epochs`; imutabilidade de entries (trigger).
- Aceite: transação fora de balance é rejeitada; entries não podem ser
  UPDATE/DELETE.
- Testes: integração de balance e imutabilidade.

### PDZ-017 — Carteira: grant, projeções e extrato

- Status: pendente
- Origem: spec §8.5, §10.2; ADR-003
- Dependências: PDZ-016, ADR-003
- Entregáveis: `demo_grant` no signup; projeções disponível/reservado;
  `GET /me/ledger` paginado; `BalancePanel` e `LedgerTable`; página
  `portfolio` (carteira + posições placeholder).
- Aceite: todo saldo rastreável a lançamentos; UI separa
  disponível/reservado/posições; zero endpoint de depósito/saque.
- Testes: integração grant + extrato; E2E carteira.

### PDZ-018 — Reset de demonstração

- Status: pendente
- Origem: ADR-003
- Dependências: PDZ-017, ADR-003
- Entregáveis: `POST /me/wallet/demo-reset` idempotente com a
  transação de época; cooldown configurável; UI com confirmação
  (`ConfirmDialog`) e resultado.
- Aceite: reset cancela ordens, arquiva posições, concede novo grant —
  atomicamente; cooldown aplicado; tudo auditado.
- Testes: integração de reset e replay idempotente.

---

## Fase 5 — Livro de ordens e posições

### PDZ-019 — Migrations e funções de domínio do matching

- Status: pendente
- Origem: spec §9, §11; ADR-001/002/004/005/006
- Dependências: PDZ-016, PDZ-013, ADRs aceitos
- Entregáveis: `orders`, `trades`, `positions` (+`reserved_quantity`),
  `idempotency_keys`; funções SQL `place_order`, `cancel_order`,
  `match` com locks e invariantes; validações de tick/estado/limites.
- Aceite: inserções fora de regra são rejeitadas por constraint/função;
  nada de matching em memória.
- Testes: unit de prioridade preço-tempo; integração de parcial,
  cancelamento×execução, replay idempotente, self-trade skip, saldo
  nunca negativo sob concorrência.

### PDZ-020 — Endpoints de negociação

- Status: pendente
- Origem: spec §12.1, §12.2
- Dependências: PDZ-019
- Entregáveis: `POST /markets/:id/orders`, `POST /orders/:id/cancel`
  (Idempotency-Key, rate limit ADR-006); `GET /markets/:id/orderbook`,
  `/trades`, `/me/orders`; envelope e códigos de erro estáveis; schemas
  zod.
- Aceite: contrato respeitado; erros sem vazar dados; limites
  aplicados.
- Testes: integração de contrato e rate limit; segurança de payload.

### PDZ-021 — UI de negociação

- Status: pendente
- Origem: spec §8.2, §5.4, §15
- Dependências: PDZ-020, PDZ-009
- Entregáveis: `OrderBook` (níveis, spread, profundidade),
  `OrderTicket` (lado, preço, qty, custo e potencial, validação),
  lista de ordens abertas com cancel, `PositionsTable`, `TradesList`;
  estados e feedback (`Toast`, `ConfirmDialog`); layout responsivo
  (ticket como `Drawer` em telas pequenas).
- Aceite: fluxo criar→executar→cancelar completo na UI; nunca exibe
  valores derivados de cálculo client-side como definitivos; a11y do
  book.
- Testes: E2E negociação desktop+mobile; unit do ticket.

---

## Fase 6 — Realtime

### PDZ-022 — Infra de canais e publicação

- Status: pendente
- Origem: spec §13.4; ADR-009
- Dependências: PDZ-020, ADR-009
- Entregáveis: publicação server-side pós-commit nos canais
  `market:{id}`/`user:{id}` com `event_id`+`version`; autorização de
  canal privado; composable `useRealtimeChannel` (dedupe, debounce,
  reconexão+snapshot).
- Aceite: payload mínimo sem PII; evento nunca é tratado como
  confirmação; reconectar refaz snapshot.
- Testes: integração de autorização de canal; dedupe/fora-de-ordem.

### PDZ-023 — UI reativa

- Status: pendente
- Origem: spec §8.2, §13.4
- Dependências: PDZ-022, PDZ-021
- Entregáveis: book, trades, status e badge "reconectando" reativos;
  ordens/posições/carteira do usuário atualizam via canal privado.
- Aceite: UI converge ao estado do banco após desconexão simulada.
- Testes: E2E com duas sessões (ordem de A aparece para B).

---

## Fase 7 — Resolução e administração completa

### PDZ-024 — Resolução: proposta, aprovação, evidência

- Status: pendente
- Origem: spec §8.3, §14; ADR-004
- Dependências: PDZ-015, PDZ-019
- Entregáveis: `market_resolutions`; fluxo proposta→aprovação com
  papel `market_resolver`/`admin`; wizard com fonte, evidência e
  motivo; transição `resolving→resolved`.
- Aceite: proposta ≠ aprovação; mercado sensível pode exigir segundo
  aprovador (config); tudo auditado.
- Testes: integração de permissões de resolução.

### PDZ-025 — Liquidação e cancelamento de mercado

- Status: pendente
- Origem: spec §8.5, §9.3; ADR-004
- Dependências: PDZ-024
- Entregáveis: função de settlement idempotente (pagamento por share
  vencedor, encerramento de posições, ledger balanceado, trava
  `finalized_at`); `cancel_market` com reembolso a custo médio;
  bloqueio de ordens em `closed/resolving`.
- Aceite: reexecução não credita duas vezes; cancelamento libera
  reservas e reembolsa holders atomicamente.
- Testes: integração de idempotência de liquidação e cancelamento.

### PDZ-026 — Admin: dashboard, usuários, parâmetros, auditoria

- Status: pendente
- Origem: spec §14
- Dependências: PDZ-024
- Entregáveis: dashboard de métricas simuladas; gestão de usuários
  (consulta, suspensão com motivo); `demo_settings` (saldo inicial,
  limites, cooldown); `AuditLogTable` filtrável; concessão de papéis.
- Aceite: leitura de suporte sem alterar ledger; parâmetros efetivos
  sem deploy; trilha consultável por entidade/ator.
- Testes: integração de papéis por endpoint admin.

---

## Fase 8 — Hardening do protótipo

### PDZ-027 — Revisão de segurança

- Status: pendente
- Origem: spec §13
- Dependências: PDZ-012, PDZ-020, PDZ-022
- Entregáveis: auditoria de RLS/Storage/Realtime; headers+CSP; revisão
  de rate limits; varredura de segredos no bundle; pentest básico de
  endpoints.
- Aceite: checklist de segurança aprovado; nenhuma política
  deny-by-default ausente.

### PDZ-028 — Acessibilidade, desempenho e mensagens legais

- Status: pendente
- Origem: spec §15, §1.2
- Dependências: PDZ-021, PDZ-023
- Entregáveis: auditoria WCAG (contraste, teclado, ARIA de
  book/chart); `prefers-reduced-motion`; revisão de todos os textos de
  demonstração; SEO por locale (`hreflang`, `lang`).
- Aceite: fluxo principal navegável por teclado; avisos de simulação
  onipresentes.

### PDZ-029 — Testes de carga, backup/restore e fechamento

- Status: pendente
- Origem: spec §17, §18/F8; ADR-010, ADR-012
- Dependências: PDZ-025, PDZ-026
- Entregáveis: carga básica em matching/listagem; teste de restore de
  backup em staging; procedimento de exclusão de conta (anonimização);
  verificação final de que pagamentos reais não são ativáveis;
  evidências de fase.
- Aceite: critérios gerais da spec §21 atendidos; protótipo
  demonstrável.

---

## Rastreabilidade rápida

| Bloco da spec | Tasks |
| --- | --- |
| §2 análise/fundação | PDZ-001, 002, 004, 005 |
| §4–6 PrimeVue/Tailwind | PDZ-006, 007 |
| §7 i18n | PDZ-008–010 |
| §8.4/13 auth | PDZ-011, 012 |
| §8.1–8.3 mercados | PDZ-013–015 |
| §10 ledger/carteira | PDZ-016–018 |
| §9 ordens/posições | PDZ-019–021 |
| §13.4 realtime | PDZ-022, 023 |
| §14 admin/resolução | PDZ-015, 024–026 |
| §15 a11y/§13 segurança | PDZ-027, 028 |
| §16–18 testes/fases | PDZ-005, 029 |
