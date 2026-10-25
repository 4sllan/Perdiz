# Perdiz — Especificação da Fundação da Plataforma

**Spec:** `perdiz-platform-foundation`
**Versão:** 1.0
**Data:** 25 de outubro de 2026
**Status:** Aguardando revisão e aprovação
**Stack:** Nuxt 4, Vue 3, TypeScript, PrimeVue, Tailwind CSS 4, Supabase, PostgreSQL

Esta especificação orienta o desenvolvimento incremental da Perdiz, uma
plataforma independente de mercados de previsão operando exclusivamente
com dinheiro fictício. Ela foi escrita após análise do estado real do
repositório (seção 2) e não presume a existência de código, módulos ou
configurações não verificados.

---

## 1. Visão geral e limites do protótipo

A Perdiz permite que usuários explorem mercados de previsão, consultem
probabilidades, visualizem gráficos, negociem posições por meio de um
livro de ordens simulado, acompanhem posições e consultem histórico de
operações. Um painel administrativo acompanha o produto desde a primeira
versão.

### 1.1 Objetivos

- Experiência responsiva em desktop, tablet e mobile, com identidade
  visual própria construída sobre PrimeVue + Tailwind CSS.
- Mercados binários na primeira versão, com modelagem preparada para
  múltiplos resultados futuros.
- Livro de ordens simulado com prioridade preço-tempo, execução
  parcial, cancelamento, reservas e histórico — determinístico e
  transacional.
- Carteira fictícia com saldo disponível, saldo reservado, posições e
  extrato, lastreada por um livro-razão de partidas dobradas.
- Internacionalização com rotas `/br/`, `/us/`, `/pt/` e `/es/`,
  detecção automática, persistência e troca manual.
- Autenticação, perfil, preferências e papéis administrativos via
  Supabase Auth + RLS.
- Atualizações em tempo real via Supabase Realtime, sem tratar eventos
  como fonte de verdade.
- Painel administrativo com gestão de mercados, categorias, traduções,
  usuários, resolução, parâmetros de demonstração e auditoria.
- Migrações versionadas, testes automatizados e trilha de auditoria.

### 1.2 Limites explícitos do protótipo

- **Somente dinheiro fictício.** Não há depósitos, saques, Pix,
  criptoativos, transferências entre usuários nem saldo resgatável.
- Nenhum endpoint, flag ou configuração desta fase habilita pagamentos
  ou operações financeiras reais.
- Aviso persistente de "modo demonstração" em todas as telas de
  negociação e carteira.
- A arquitetura de demonstração não constitui autorização para operação
  comercial (ver seção 16).

### 1.3 Identidade própria

A Perdiz possui marca, paleta, tipografia, código e arquitetura
próprios. Plataformas de mercados de previsão existentes servem apenas
como referência conceitual de experiência; nenhum elemento proprietário
(logotipo, textos, layout, dados) pode ser copiado.

---

## 2. Análise do repositório (estado real)

Análise executada em 25/10/2026 sobre o working tree do repositório.

### 2.1 Estado geral

O repositório **não está vazio**: contém um scaffold Nuxt 4 mínimo e
funcional, com uma landing page de fundação. Não há aplicação de
mercados, autenticação, servidor de APIs, banco de dados ou i18n
implementados. O projeto está na fase de fundação.

### 2.2 Arquivos e estrutura existentes

```text
perdiz/
├── app/
│   ├── app.vue                     # <NuxtPage /> apenas
│   ├── assets/css/main.css         # Tailwind 4 + @theme (tokens da marca)
│   └── pages/index.vue             # Landing page de fundação
├── docs /                          # ATENÇÃO: nome com espaço final
│   └── specs/                      # Vazio
├── shared/
│   └── constants/simulation.ts     # SIMULATION_NOTICE
├── tests/
│   ├── unit/simulation.test.ts     # Teste do aviso de simulação
│   └── e2e/foundation.spec.ts      # Smoke SSR da landing
├── .devin/sdd.md                   # Processo SDD
├── nuxt.config.ts
├── package.json                    # pnpm 11.18.0, Node >=24.18.1 <25
├── vitest.config.ts                # Vitest 5, environment node
├── playwright.config.ts            # Servidor próprio na porta 3100
├── eslint.config.mjs               # @nuxt/eslint-config + overrides
├── tsconfig.json / tsconfig.tools.json
├── .prettierrc.json / .prettierignore / .npmrc / .nvmrc / .gitignore
└── README.md
```

**Não existem:** `server/`, `i18n/`, `supabase/`, `components/`,
`composables/`, `middleware/`, `layouts/`, `plugins/`, testes de
integração, CI, arquivos de ambiente ou qualquer código de domínio.

### 2.3 Dependências instaladas (verificado em package.json)

| Item | Versão | Observação |
| --- | --- | --- |
| nuxt | 4.6.2 | `compatibilityDate: '2026-10-24'`, `typescript.strict: true` |
| vue / vue-router | 3.5.44 / 5.4.0 | |
| tailwindcss | 4.3.3 | via `@tailwindcss/vite` 4.3.3 (devDep), **não** via `@nuxtjs/tailwindcss` |
| @nuxt/fonts | 1.1.0 | Módulo ativo |
| @nuxt/icon | 2.6.0 | Módulo ativo, com `@iconify-json/lucide` 1.2.147 |
| typescript / vue-tsc | 5.9.3 / 3.3.13 | |
| vitest / @nuxt/test-utils | 5.0.5 / 4.3.4 | test-utils instalado, ainda não utilizado |
| @playwright/test | 1.64.1 | Chromium não baixado na instalação |
| eslint / @nuxt/eslint-config | 10.13.0 / 1.17.0 | Flat config com overrides locais |
| prettier / prettier-plugin-tailwindcss | 3.9.10 / 0.8.1 | |

**Ausentes (não instalados):** PrimeVue, `@primevue/nuxt-module`,
`@primeuix/themes`, `tailwindcss-primeui`, `@nuxtjs/i18n`,
`@nuxtjs/supabase`, `@supabase/ssr`, `@supabase/supabase-js`, `zod`,
Pinia, qualquer ORM/query builder.

### 2.4 Versões verificadas no registro npm (25/10/2026)

| Pacote | Última versão |
| --- | --- |
| primevue / @primevue/nuxt-module | 5.0.4 / 5.0.4 |
| @primeuix/themes | 3.1.0 |
| tailwindcss-primeui | 0.6.1 |
| @nuxtjs/i18n | 10.6.0 |
| @nuxtjs/supabase | 2.1.0 |
| @supabase/ssr / @supabase/supabase-js | 0.12.7 / 2.118.0 |
| zod | 4.6.7 |

Versões exatas devem ser fixadas no momento da instalação (`save-exact`
já está ativo no `.npmrc`), preferindo versões com mais de 7 dias de
publicação. A compatibilidade do módulo PrimeVue com Nuxt 4.6 deve ser
confirmada na documentação da versão instalada antes da configuração.

### 2.5 Identidade visual já estabelecida

`app/assets/css/main.css` define tokens via `@theme` que constituem a
base da marca e devem ser preservados/estendidos, não substituídos:

- Cores: `--color-paper` `#f3f0e7`, `--color-ink` `#26372b`,
  `--color-muted` `#566050`, `--color-accent` `#a33f24`,
  `--color-line` `#d1d3c5`.
- Fontes: `--font-sans` (Avenir Next/system), `--font-display` (serifa
  Iowan Old Style/Palatino). Sem dependência de fontes remotas.
- Utility própria `foundation-background`, animação `arrive`,
  `color-scheme: light`, foco visível com outline de accent.
- Landing: wordmark "perdiz.", skip-link, badge "SIMULAÇÃO", aviso
  `SIMULATION_NOTICE` ("Modo demonstração — sem dinheiro real").

### 2.6 Achados e riscos da análise

1. **Diretório `docs ` com espaço final.** Existe `docs /` (com espaço)
   contendo `specs/` vazio. O README referencia documentos dentro dele
   que foram removidos do working tree (deleções não commitadas e
   intencionais — não são base desta spec). Esta spec é criada em
   `docs/specs/` (sem espaço), conforme o caminho aprovado na
   solicitação. Resulta em dois diretórios irmãos (`docs ` e `docs/`);
   a consolidação fica registrada como decisão pendente (D-11) e os
   links quebrados do README como impacto a corrigir na Fase 0.
2. **Testes configurados, não executados.** Por orientação do
   responsável, `pnpm test`/`pnpm test:e2e` não rodaram ainda; o smoke
   E2E cobre apenas a landing. A Fase 0 prevê a primeira execução.
3. **Integração Tailwind já decidida.** O projeto usa
   `@tailwindcss/vite` diretamente; **não introduzir**
   `@nuxtjs/tailwindcss` nem `tailwind.config.js`. O plugin
   `tailwindcss-primeui` deve ser integrado via CSS (`@import`), rota
   compatível com Tailwind v4, e não via `plugins` de config JS.
4. **`.prettierignore` exclui `docs `/ e `.devin/`** mas não `docs/`;
   o Prettier passará a formatar a nova pasta — aceitável e desejável,
   mas registra a divergência de tratamento entre as duas pastas.
5. **Working tree com alterações não commitadas** (`sdd.md`,
   `eslint.config.mjs`, `nuxt.config.ts`, `package.json` etc. relativos
   ao commit inicial). A spec não depende disso, mas a Fase 0 deve
   normalizar o estado do git antes de novos incrementos.
6. **`vue-router` 5.4.0** instalado explicitamente — versão major à
   frente da linha 4.x; validar compatibilidade com `@nuxtjs/i18n` 10.x
   durante a instalação (teste de smoke de rotas localizadas).
7. **Sem CI.** Nenhum workflow existe; a Fase 0 inclui pipeline mínimo.
8. **Sem `.env.example` ou runtimeConfig** definidos; chaves Supabase
   serão introduzidas na Fase 0 com segregação cliente/servidor.

### 2.7 Arquivos a preservar, criar e alterar

- **Preservar:** `app/assets/css/main.css` (estender), `app/pages/index.vue`
  (evoluir para página localizada), `shared/constants/simulation.ts`,
  configurações de toolchain (`.npmrc`, `.nvmrc`, `tsconfig*.json`,
  `vitest.config.ts`, `playwright.config.ts`), `eslint.config.mjs`
  (overrides locais do responsável).
- **Alterar:** `package.json` (novas dependências), `nuxt.config.ts`
  (módulos i18n/PrimeVue, runtimeConfig, routeRules), `README.md`
  (corrigir links quebrados e estado), `.gitignore` (`.env*` já
  coberto), `.prettierignore` (decidir tratamento de `docs/`).
- **Criar:** `server/`, `i18n/locales/`, `app/components/`,
  `app/composables/`, `app/middleware/`, `app/layouts/`,
  `app/plugins/`, `supabase/`, `shared/types/`, `tests/integration/`,
  `.env.example`, CI, ADRs em `docs/adr/`.

---

## 3. Arquitetura

### 3.1 Visão lógica

```text
Navegador (Vue 3 + PrimeVue + Tailwind)
        │
        ▼
Nuxt 4 — SSR, rotas localizadas, endpoints server-side (Nitro)
        │                 └──────────► Supabase Auth (sessão)
        ▼
Serviços de domínio (server/services/)
        ├── Mercados e catálogo
        ├── Motor de ordens simulado (matching preço-tempo)
        ├── Livro-razão fictício (partidas dobradas)
        ├── Resolução e liquidação
        └── Administração e auditoria
        ▼
PostgreSQL (Supabase)
        ├── Transações atômicas, constraints, funções de domínio
        ├── RLS nas tabelas expostas ao cliente
        └── Realtime (eventos autorizados de domínio)
```

### 3.2 Regras arquiteturais inegociáveis

- **O servidor é a fonte de verdade.** Preços de execução, saldos,
  posições, reservas e resultados jamais são determinados pelo
  navegador ou por eventos Realtime.
- Toda mutação financeira simulada (ordem, execução, cancelamento,
  liquidação, ajuste) ocorre em transação PostgreSQL atômica.
- Chaves privilegiadas (`service_role`) existem apenas no servidor
  Nitro, via `runtimeConfig` privado — nunca em `runtimeConfig.public`.
- Auto-imports do Nuxt respeitando a divisão `app/` (cliente),
  `server/` (servidor) e `shared/` (código isomorfo: tipos, constantes,
  schemas compartilháveis).
- Validação de entrada com schemas tipados (zod) em todo endpoint que
  recebe payload.
- Idempotência em todos os comandos que alteram ordens, saldos ou
  posições.

### 3.3 Organização de diretórios

```text
perdiz/
├── app/
│   ├── assets/css/main.css        # Tailwind 4, @theme, camadas
│   ├── components/
│   │   ├── ui/                    # Wrappers e extensões Perdiz sobre PrimeVue
│   │   ├── markets/               # MarketCard, MarketList, PriceChart
│   │   ├── orderbook/             # OrderBook, OrderForm, OrderRow
│   │   ├── wallet/                # BalanceSummary, LedgerTable
│   │   ├── trading/               # PositionsTable, TradesList
│   │   └── layout/                # Header, LocaleSwitcher, SimulationBanner
│   ├── composables/               # useMarkets, useOrderbook, useWallet, useRealtime*
│   ├── layouts/                   # default.vue, admin.vue, auth.vue
│   ├── middleware/                # auth, admin, guest
│   ├── pages/
│   │   ├── index.vue              # Home/exploração
│   │   ├── markets/index.vue      # Catálogo
│   │   ├── markets/[slug].vue     # Detalhe + livro + ticket
│   │   ├── portfolio/index.vue    # Posições e carteira
│   │   ├── activity/index.vue     # Histórico
│   │   ├── settings/              # Perfil e preferências
│   │   ├── auth/                  # login, register, reset
│   │   └── admin/                 # dashboard, markets, categories,
│   │                              #   translations, users, audit, settings
│   ├── plugins/                   # realtime.client.ts, etc.
│   └── utils/
├── i18n/locales/                  # br.json, us.json, pt.json, es.json
├── server/
│   ├── api/                       # Endpoints REST
│   ├── middleware/                # Sessão, rate limit, request id
│   ├── services/                  # markets/, orderbook/, ledger/,
│   │                              #   settlement/, admin/, i18n/
│   ├── repositories/              # Acesso a dados via Supabase
│   ├── plugins/                   # Reconciliação agendada etc.
│   ├── schemas/                   # zod: entrada/saída de API
│   └── utils/                     # supabase clients, erros, auditing
├── shared/
│   ├── types/                     # Tipos de domínio isomorfos
│   └── constants/                 # SIMULATION_NOTICE, limites, unidades
├── supabase/
│   ├── migrations/                # SQL versionado
│   ├── seed.sql                   # Somente dados fictícios
│   └── config.toml
├── tests/{unit,integration,e2e}/
└── docs/{specs,adr}/
```

Diretórios são criados conforme os módulos entram; não versionar pastas
vazias.

---

## 4. Estratégia PrimeVue

### 4.1 Instalação e configuração

- Dependências: `primevue` + `@primeuix/themes` (runtime);
  `@primevue/nuxt-module` (dev). Versões fixadas em `package.json`.
- Módulo registrado em `nuxt.config.ts` com chave `primevue`; o módulo
  auto-registra componentes com tree-shaking — não importar componentes
  manualmente salvo em casos documentados.
- `primevue.options.theme.preset`: preset base (Aura) **customizado**
  para os tokens da Perdiz — o tema próprio é definido via `definePreset`
  em arquivo dedicado (`app/assets/theme/perdiz-preset.ts` ou caminho
  equivalente suportado pela versão instalada), mapeando a paleta
  paper/ink/accent existente para os tokens semânticos PrimeVue.
- `theme.options.cssLayer`: habilitado com nome `primevue` para controle
  de especificidade frente ao Tailwind (ver seção 6).
- `darkModeSelector`: definido junto à decisão de tema escuro (D-06).
- `ripple`: conforme direção de motion do produto; acessibilidade e
  `prefers-reduced-motion` devem ser respeitados.
- Componentes registrados sob demanda (o módulo suporta
  `components.include`); manter lista explícita para controlar bundle.

### 4.2 Componentes PrimeVue previstos

| Necessidade | Componente PrimeVue |
| --- | --- |
| Ações | `Button`, `ButtonGroup`, `SplitButton` |
| Formulários | `InputText`, `InputNumber`, `Select`, `SelectButton`, `DatePicker`, `Checkbox`, `RadioButton`, `ToggleSwitch`, `Slider`, `InputGroup`, `FloatLabel`, `Message` |
| Navegação | `Menubar`/`NavigationMenu` equivalente, `Tabs`, `Breadcrumb`, `Paginator` |
| Dados | `DataTable`, `DataView`, `TreeTable` (admin), `Tag`, `Badge`, `ProgressBar`, `Skeleton` |
| Sobreposição | `Dialog`, `Drawer`, `Popover`, `Tooltip`, `ConfirmDialog` |
| Feedback | `Toast`/`ToastService`, `Message`, `InlineMessage`, `ProgressSpinner` |
| Misc | `Card`, `Avatar`, `Chip`, `Divider`, `Stepper` (fluxos guiados) |

Componentes de gráfico: avaliar `Chart` do PrimeVue (wrapper
Chart.js) vs. componente próprio leve para sparklines de probabilidade
— decisão pendente D-08, pois adicionar Chart.js é custo de bundle.

### 4.3 Uso disciplinado

- PrimeVue atende componentes genéricos; **não recriar** botões,
  inputs, tabelas, diálogos ou toasts.
- Personalização visual via design tokens do preset; ajustes finos por
  componente via `pt` (pass-through) somente quando tokens não forem
  suficientes — nunca CSS global sobre classes internas `p-*`.
- Serviços (`ToastService`, `ConfirmDialog`, `DialogService`)
  registrados uma vez no plugin/app e consumidos via composables.

---

## 5. Estratégia Tailwind CSS e sistema visual

### 5.1 Integração (já estabelecida — preservar)

- Tailwind 4 via `@tailwindcss/vite` em `nuxt.config.ts`; entrada única
  `app/assets/css/main.css` com `@import "tailwindcss"`.
- Tokens de tema em `@theme` (CSS-first). Não criar `tailwind.config.js`.
- Adicionar `@import "tailwindcss-primeui"` para expor utilitários
  semânticos do tema PrimeVue (`bg-primary`, `text-muted-color`,
  `surface-*`) alinhando os dois sistemas à mesma fonte de tokens.

### 5.2 Design tokens Perdiz

Camadas de tokens (a consolidar num único mapa de verdade):

| Conceito | Token Tailwind (`@theme`) | Token PrimeVue (preset) |
| --- | --- | --- |
| Fundo da aplicação | `--color-paper` | `surface.ground`/`surface.0` conforme tema |
| Texto principal | `--color-ink` | `text.color` |
| Texto secundário | `--color-muted` | `text.muted.color` |
| Ação/marca | `--color-accent` | `primary.color` + escala |
| Divisores | `--color-line` | `content.border.color` |
| Semânticas de mercado | `--color-up`/`--color-down` (a criar) | `green`/`red` scales ou alias próprio |
| Tipografia | `--font-sans`, `--font-display` | `font.family` |
| Radius/sombras | `--radius-*`, `--shadow-*` (a criar) | `border.radius`, `shadow.*` |

A paleta existente (paper/ink/accent) define a marca. Novos tokens
semânticos para dados (probabilidade alta/baixa, compra/venda,
estados de mercado) serão nomeados de forma neutra (`up`/`down` ou
`buy`/`sell`), documentados no ADR de tokens (D-05).

### 5.3 Responsividade e princípios de estilo

- Mobile-first; breakpoints padrão do Tailwind (`sm` 640, `md` 768,
  `lg` 1024, `xl` 1280). Layout de negociação deve ter composição
  dedicada para telas < `lg` (ticket de ordem como drawer/sheet).
- Classes utilitárias nos componentes; CSS global restrito a resets,
  base, tokens, fontes e utilitários nomeados com justificativa
  (padrão `foundation-background`).
- `prettier-plugin-tailwindcss` já ordena classes — manter.
- Evitar `!important`; resolver especificidade por camadas CSS.

### 5.4 Componentes próprios Perdiz

Criados quando PrimeVue não cobre a necessidade de domínio,
compondo PrimeVue internamente quando útil:

- `MarketCard` — pergunta, probabilidade, sparkline, estado, volume
  simulado.
- `OrderBook` — agregação de bids/asks, profundidade, spread.
- `OrderTicket` — compra/venda com `InputNumber`, resumo de custo e
  resultado potencial, validação de limites.
- `PriceChart` — série histórica de probabilidade/preço.
- `BalancePanel`, `LedgerTable`, `PositionsTable`, `TradesList`.
- `SimulationBanner` — aviso persistente de demonstração.
- `LocaleSwitcher`, `MarketStatusTag`, `ResolutionRulesPanel`.
- Admin: `MarketEditor`, `ResolutionWizard`, `AuditLogTable`.

---

## 6. Integração PrimeVue × Tailwind

Decisão estrutural: **modo styled do PrimeVue + Tailwind para layout e
composição**, com ponte de tokens via `tailwindcss-primeui`.

Regras de convivência:

1. **Responsabilidades separadas.** Tailwind: layout, espaçamento,
   tipografia de página, responsividade, grades, alinhamento.
   PrimeVue: aparência interna dos componentes (superfícies, bordas,
   estados, foco) via tokens do preset.
2. **Camadas CSS.** Habilitar `cssLayer` do tema PrimeVue
   (`name: 'primevue'`) posicionada antes de `utilities`, garantindo
   que utilitários Tailwind possam ajustar layout de componentes
   (margem, largura) sem `!important` e sem disputar estilos internos.
3. **Proibido:** sobrescrever classes internas `p-*` com CSS global;
   usar `!` em utilitários; dois temas concorrentes; importar CSS de
   preset legado (v3) junto ao `@primeuix/themes`.
4. **Ajustes internos de componente** via API `pt` (pass-through)
   versionada no código, ou via tokens do preset — nunca seletores
   globais frágeis.
5. **Modo unstyled/Volt fica fora desta fase.** Se a necessidade de
   controle visual total surgir, documentar migração em ADR futuro.
6. Utilitários semânticos do `tailwindcss-primeui` (`bg-primary`,
   `text-muted-color`) são preferidos a duplicar valores hex na
   marcação quando se referem ao tema PrimeVue; tokens `paper/ink/...`
   seguem para a identidade própria fora dos componentes.

---

## 7. Internacionalização

### 7.1 Módulo e rotas

- `@nuxtjs/i18n` 10.x, `strategy: 'prefix'` — todas as rotas
  localizadas sob `/br/`, `/us/`, `/pt/`, `/es/`.
- Os prefixos são **códigos de locale do produto** (não ISO puro):

| Prefixo | Locale | Idioma | Moeda de exibição padrão |
| --- | --- | --- | --- |
| `br` | `pt-BR` | Português (Brasil) | BRL |
| `us` | `en-US` | English (US) | USD |
| `pt` | `pt-PT` | Português (Portugal) | EUR |
| `es` | `es-ES` | Español | EUR |

- Arquivos de tradução em `i18n/locales/{br,us,pt,es}.json`.

### 7.2 Detecção, persistência e troca

- `detectBrowserLanguage` com cookie próprio (`perdiz_locale`), uso de
  `Accept-Language` no primeiro acesso à raiz, fallback `/br/`.
- Preferência explícita (cookie/perfil) prevalece sobre detecção.
- Após login, sincronizar preferência do perfil com a local conforme
  regra de precedência documentada (perfil vence cookie; cookie vence
  navegador).
- `redirectOn: 'all'` (comportamento v10) com proteção anti-loop:
  nunca redirecionar URLs já prefixadas; preservar path e query válidos.
- Seletor manual de idioma sempre visível no layout; troca preserva a
  rota equivalente (`switchLocalePath`), com fallback indicado quando
  a tradução do conteúdo não existir.
- `htmlAttrs lang` dinâmico por locale; `langDir`/arquivos validados.

### 7.3 Distinções obrigatórias

- **Idioma ≠ país ≠ moeda ≠ elegibilidade.** O prefixo define locale de
  interface; a moeda de exibição é preferência de apresentação (saldo
  fictício tem unidade própria, sem conversão implícita — ver 10.3);
  elegibilidade regulatória não é inferida nesta fase e nunca pelo
  idioma do navegador.
- Conteúdo de mercado (título, descrição, regras, fonte) é traduzido
  por locale com estado de publicação próprio e fallback sinalizado.
- Datas/números/moedas via `Intl.*` conforme locale; UTC no servidor.

### 7.4 Qualidade das traduções

- Chaves semânticas (`market.order.buy`, `wallet.demo.balance`).
- Pluralização e interpolação do vue-i18n; proibido concatenar
  fragmentos.
- Teste automatizado de chaves ausentes/órfãs e JSON válido entre os
  quatro arquivos.

---

## 8. Módulos funcionais

### 8.1 Público — home e exploração

- Destaques, recentes, populares, próximos do encerramento.
- Categorias configuráveis (política, economia, esportes, tecnologia,
  cultura…) com traduções.
- Busca por título/descrição/tags; filtros por estado, categoria,
  encerramento; ordenação por atividade, probabilidade e volume
  simulado; paginação com limites.
- `SimulationBanner` persistente; estados de loading (`Skeleton`),
  vazio, erro e indisponibilidade.

### 8.2 Página do mercado

- Título, descrição, categoria, estado, regras de resolução, fonte de
  referência e datas (abertura, encerramento).
- Resultados possíveis com preços/probabilidades indicativos —
  rotulados como não-certeza.
- `PriceChart` histórico de negociações simuladas.
- `OrderBook` com bids/asks, spread e profundidade.
- `OrderTicket` (autenticado): lado, preço limite, quantidade, custo
  estimado, resultado potencial — sem promessa de retorno.
- Lista das próprias ordens abertas com cancelamento; trades recentes
  públicos sem dados pessoais.

### 8.3 Tipos e ciclo de vida do mercado

- v1: binário `YES`/`NO`. Modelagem suporta N resultados; negociação
  multirresultado exige fase e testes próprios.
- Estados: `draft` → `review` → `open` ⇄ `paused` → `closed` →
  `resolving` → `resolved`; `cancelled` a partir de estados definidos
  (política de reversão em ADR D-04).
- Toda transição validada server-side, com motivo e auditoria.

### 8.4 Conta e perfil

- Supabase Auth: e-mail/senha, verificação de e-mail, recuperação,
  logout, gestão de sessão. Senhas nunca em tabelas próprias.
- Perfil: nome público, avatar (Storage), locale, região declarada.
- Preferências: locale, moeda de exibição, fuso.
- Histórico: ordens, trades, lançamentos do ledger, posições.

### 8.5 Carteira fictícia

- Saldo inicial de demonstração configurável (parâmetro admin).
- Exibição separada: disponível, reservado, valor em posições.
- Extrato com lançamentos rastreáveis até ordem/trade/liquidação.
- Reini­cialização de saldo apenas por fluxo controlado, limitado e
  auditado (ADR D-03).
- Sem transferências entre usuários; sem depósito/saque — botões
  eventualmente presentes ficam desabilitados e rotulados
  "Indisponível no protótipo".

---

## 9. Livro de ordens simulado — regras de negócio

### 9.1 Escopo v1

- Somente ordens **limitadas**; compra e venda de posições.
- Execução parcial e total; cancelamento de ordem aberta; expiração
  opcional por tempo (GTC/GTD); histórico completo.

### 9.2 Regras determinísticas

- **Prioridade preço-tempo:** melhor preço primeiro; empate → ordem
  mais antiga (`created_at`, desempate por `id`).
- Matching executado **dentro de transação PostgreSQL** (função de
  domínio), com locks consistentes (`SELECT ... FOR UPDATE` nos
  registros afetados) — nunca em memória do servidor como fonte de
  verdade.
- Preço normalizado em `[0,1]` para binários, com tick configurável
  por tipo de mercado (ADR D-01); quantidade e precisão com regras de
  arredondamento definidas (ADR D-02).
- Validações na aceitação: mercado `open` e dentro da janela; outcome
  pertence ao mercado; preço no tick/faixa; quantidade dentro de
  mínimo/máximo; limites por usuário e por mercado (ADR D-06); saldo/
  posição suficiente; chave de idempotência única por usuário.
- **Reservas:** compra reserva custo máximo (`price × qty`) no ledger;
  venda reserva a posição vendida. Origem/lastro das posições vendáveis
  definido em ADR D-04 (proibida venda descoberta e crédito sem lastro).
- Execução: preço do trade = preço da ordem passiva (maker); execução
  parcial atualiza `remaining_quantity`, libera/mantém reserva
  proporcional, gera trade + lançamentos + posições atomicamente.
- Cancelamento: libera somente reserva não executada; cancelamento
  simultâneo à execução resolve pelo resultado serializável da
  transação (um vence; o outro observa estado final).
- **Autoexecução:** política self-trade definida em ADR D-05
  (cancel-newest vs. rejeitar vs. permitir) — default recomendado:
  impedir matching entre ordens do mesmo usuário cancelando a mais
  recente.
- Ordens e trades recebem `simulation = true` e unidade de
  demonstração explícita.

### 9.3 Idempotência e concorrência

- `Idempotency-Key` obrigatória em `POST /orders`, cancel e operações
  admin críticas; `unique(user_id, idempotency_key)` com replay
  retornando o resultado original.
- Conflitos de concorrência não podem produzir: saldo negativo,
  reserva negativa, execução duplicada, posição inconsistente ou
  liquidação repetida. Constraints no banco garantem invariantes como
  rede de segurança (`CHECK` de não-negatividade, `remaining_quantity
  BETWEEN 0 AND quantity`).
- Falhas no meio do matching → rollback total; resposta de erro com
  código previsível.

---

## 10. Carteira fictícia e livro-razão

### 10.1 Partidas dobradas

- `ledger_accounts`: contas por usuário e contas de sistema
  (emissão de demonstração, reservas, liquidação).
- `ledger_transactions`: cabeçalho com tipo, referência, status,
  `idempotency_key` única.
- `ledger_entries`: lançamentos por conta; **soma = 0 por transação e
  por unidade**, validado em função transacional.
- Lançamentos contabilizados são imutáveis; correções somente por
  transação compensatória auditada.

### 10.2 Derivações

- Saldo disponível/reservado e posições são **projeções
  reconciliáveis** do ledger + trades — atualizadas transacionalmente e
  verificadas por rotina de reconciliação que detecta divergências
  (ordem vs. reserva vs. trade vs. posição vs. ledger).

### 10.3 Unidade de demonstração

- Unidade própria (`PERDIZ-CR` ou similar, definida em ADR D-02),
  separada por ambiente (dev/stage/prod não compartilham nem convertem
  saldos). Moedas BRL/USD/EUR são apenas formatação de exibição —
  **nunca** conversão implícita.

---

## 11. Modelo de dados PostgreSQL

Proposta inicial; tipos/constraints finais definidos na primeira
migration. Toda tabela exposta tem RLS; `numeric` sempre (nunca
`float`); UTC.

| Tabela | Propósito e pontos-chave |
| --- | --- |
| `profiles` | `id` → `auth.users`; `display_name`, `avatar_path`, `locale`, `region`, timestamps. |
| `user_roles` | PK `(user_id, role)`; roles `user`, `content_editor`, `moderator`, `market_resolver`, `admin`. Atribuição só por fluxo privilegiado auditado — nunca via metadados editáveis pelo cliente. |
| `user_preferences` | `locale`, `display_currency`, `timezone`. |
| `categories` + `category_translations` | `slug` único, `sort_order`, `is_active`; tradução por `(category_id, locale)`. |
| `markets` | `slug` único, `category_id`, `status`, `market_type`, `opens_at`, `closes_at`, `resolved_at`, `resolution_outcome_id`, `version` (lock otimista). |
| `market_translations` | `title`, `description`, `resolution_rules`, `resolution_source_url`, `publish_state` por `(market_id, locale)`. |
| `market_outcomes` | `outcome_key`, `sort_order`, `is_winner`; unique `(market_id, outcome_key)`. |
| `orders` | `side`, `order_type='limit'`, `price numeric` na faixa/tick, `quantity`, `remaining_quantity`, `status`, `idempotency_key`; unique `(user_id, idempotency_key)`; CHECKs de não-negatividade. |
| `trades` | `buy_order_id`, `sell_order_id`, `buyer_id`, `seller_id`, `price`, `quantity`, `executed_at`, `simulation=true`. |
| `ledger_accounts` / `ledger_transactions` / `ledger_entries` | Partidas dobradas (seção 10); `unit_code`; `idempotency_key` única; entradas imutáveis. |
| `positions` | `quantity`, `average_cost`; unique `(user_id, market_id, outcome_id)`. |
| `market_resolutions` | `outcome_id`, `resolution_status`, `source_url`, `evidence jsonb`, `reason`, `proposed_by`, `approved_by`, `finalized_at` — proposta ≠ aprovação. |
| `audit_logs` | `actor_user_id`, `action`, `entity_type/id`, `reason`, `request_id`, `metadata jsonb` (sem segredos). Append-only. |
| `favorites` | `(user_id, market_id)`. |
| `idempotency_keys` ou equivalente | Registro de comandos e respostas para replay seguro. |
| `rate_limit_buckets` ou equivalente | Suporte a limites de uso server-side. |

Índices mínimos: orders por `(market_id, status, side, price,
created_at)` para matching; trades por `(market_id, executed_at)`;
entries por `account_id`; audit por `(entity_type, entity_id)`;
traduções por `(locale, publish_state)`.

---

## 12. APIs e serviços de domínio

### 12.1 Endpoints (contratos a versionar)

```text
Público
  GET  /api/markets                      lista + filtros/paginação
  GET  /api/markets/:slug                detalhe por locale
  GET  /api/markets/:id/orderbook        níveis agregados
  GET  /api/markets/:id/trades           trades públicos (sem PII)
  GET  /api/categories

Autenticado
  GET  /api/me                           perfil + preferências + carteira resumo
  PATCH /api/me/preferences              locale, moeda de exibição, fuso
  GET  /api/me/portfolio                 posições + saldos
  GET  /api/me/orders | trades | ledger  históricos paginados
  POST /api/markets/:id/orders           criar ordem (Idempotency-Key)
  POST /api/orders/:id/cancel            cancelar (Idempotency-Key)
  POST /api/me/favorites · DELETE /api/me/favorites/:marketId
  POST /api/me/wallet/demo-reset         reinício controlado (se aprovado)

Admin (papel verificado server-side)
  GET  /api/admin/dashboard
  CRUD /api/admin/categories · /api/admin/markets
  POST /api/admin/markets/:id/{publish,pause,close,cancel}
  POST /api/admin/markets/:id/resolutions          propor
  POST /api/admin/resolutions/:id/{approve,reject} aprovar/rejeitar
  GET  /api/admin/users · POST /api/admin/users/:id/suspend
  GET  /api/admin/audit-logs
  GET/PATCH /api/admin/settings                  parâmetros de demo
```

### 12.2 Contratos

- Entrada validada por schema zod; saída com envelope consistente
  (`data`/`error{code,message}`).
- Erros com códigos estáveis (`MARKET_NOT_OPEN`, `INSUFFICIENT_FUNDS`,
  `PRICE_OUT_OF_TICK`, `SELF_TRADE`, `IDEMPOTENT_REPLAY`, `FORBIDDEN`)
  sem vazar dados internos ou de terceiros.
- Rate limiting em auth, busca e mutações financeiras; `request_id`
  propagado a logs e auditoria.
- Nunca aceitar do cliente: `user_id`, `role`, saldo final, preço de
  execução, resultado de mercado.

### 12.3 Serviços (server/services/)

`market.service` (catálogo/estado), `orderbook.service` (matching,
reservas, cancelamento — chamando funções SQL), `ledger.service`
(transações balanceadas), `position.service`, `settlement.service`
(resolução→liquidação idempotente), `admin.service`, `audit.service`,
`preference.service`. Repositórios isolam o acesso Supabase; funções
RPC/PLpgSQL concentram as transações críticas.

---

## 13. Autenticação, autorização, Realtime e segurança

### 13.1 Integração Supabase — decisão

Duas rotas avaliadas (ADR D-07): `@nuxtjs/supabase` 2.x vs.
`@supabase/ssr` + `supabase-js` manual. Recomendação inicial:
`@supabase/ssr` manual, por controle explícito dos três clientes
(browser público, servidor por-request com cookies, admin
`service_role` confinado a `server/utils`), sem comportamentos
automáticos do módulo (redirects) colidindo com o i18n customizado.
Decisão final registrada em ADR antes da implementação.

### 13.2 Autorização

- Sessão verificada em todo endpoint privado; papel consultado em
  `user_roles` no banco — nunca confiado a claims/JWT editáveis ou
  metadados de usuário.
- Middleware de rota (`auth`, `admin`) como UX; validação real sempre
  server-side.
- Elevação de privilégio impossível pelo cliente; concessão de papéis
  auditada.

### 13.3 RLS

- Padrão: negação até política explícita. Habilitar em toda tabela
  alcançável pelo cliente Supabase.
- `profiles`: leitura do próprio (público mínimo: `display_name`,
  avatar); escrita dos campos permitidos pelo próprio.
- `orders`, `positions`, `ledger_*`: leitura apenas do titular;
  escrita exclusiva via servidor (service role).
- `trades`/orderbook público: leitura de dados agregados sem PII.
- `markets`/`categories`/traduções: leitura pública somente de
  `publish_state` publicado.
- `audit_logs`, `user_roles`, `market_resolutions`: admin conforme
  papel; escrita só servidor.
- Revisão de políticas de Storage (avatars, imagens de mercado) e
  autorização de canais Realtime.

### 13.4 Realtime

- Eventos: `market.updated`, `orderbook.updated`, `trade.created`,
  `market.status_changed` (públicos, payload mínimo);
  `order.updated`, `position.updated`, `wallet.updated` (canal
  privado por usuário, autorizado).
- Payloads com `event_id`/`version` monotônica; cliente trata
  duplicados e fora de ordem; após reconexão, refetch de snapshot via
  API e reconciliação.
- Evento é notificação, não confirmação; proibido transmitir e-mail,
  saldo exato além do necessário, ou dados de ordens de terceiros.
- Limites de frequência/agregação em ADR D-09.

### 13.5 Segurança transversal

- `service_role` somente em `runtimeConfig` privado; `.env.example`
  sem valores; verificação de que nenhuma chave privilegiada chega ao
  bundle (teste automatizado de build).
- Headers de segurança + CSP; CSRF conforme estratégia de cookies;
  limites de payload; sanitização de conteúdo admin que vira HTML.
- Logs estruturados sem tokens/senhas/cookies; retenção e exclusão de
  dados pessoais documentadas; dependências auditadas; backups com
  teste de restauração (ambientes separados local/staging/prod).

---

## 14. Painel administrativo e auditoria

### 14.1 Funcionalidades (v1)

- Dashboard: usuários, mercados por estado, ordens/trades, volume
  fictício, saúde (falhas de matching, divergências de reconciliação).
- Catálogo: CRUD de categorias e mercados + traduções por locale com
  estado de publicação.
- Ciclo de vida: revisão → publicação; pausar, encerrar, cancelar
  (política de reversão); resolver via proposta + aprovação.
- Resolução: wizard com fonte, evidência, motivo; aprovação por papel
  `market_resolver`/`admin`, idealmente dupla em mercados sensíveis.
- Usuários: consulta, suspensão com motivo, visualização de conta.
- Suporte: consulta de ordens/trades/ledger por usuário (leitura).
- Parâmetros de demonstração: saldo inicial, limites, unidade.
- Auditoria: trilha consultável e filtrável; erros operacionais sem
  segredos.

### 14.2 Controles

- Papéis separados (`content_editor`, `moderator`, `market_resolver`,
  `admin`); menor privilégio por padrão.
- Operações críticas exigem motivo + confirmação; tudo registrado em
  `audit_logs` com `request_id`.
- Proibido editar/apagar lançamentos do ledger; correções via
  compensação auditada.
- Liquidação idempotente: reexecução não credita duas vezes;
  `finalized_at` + trava de estado garantem.

---

## 15. Acessibilidade, estados e UX

- Alvo WCAG 2.2 AA: contraste ≥ 4,5:1 para texto; foco visível
  (padrão accent já definido); navegação por teclado completa,
  inclusive livro de ordens e ticket; skip-link mantido.
- `prefers-reduced-motion` respeitado (animação `arrive` já condiciona;
  ripple/animações PrimeVue idem).
- Componentes PrimeVue fornecem base ARIA; componentes próprios
  (`OrderBook`, `PriceChart`) exigem semântica equivalente — tabela
  acessível ou região com descrição textual dos dados.
- Estados padronizados: loading (`Skeleton`), erro recuperável com
  ação, vazio ilustrado, offline/reconectando (banner), sucesso com
  feedback (`Toast`), indisponível no protótipo (rótulo explícito).
- Tema claro/escuro: pendente D-06; se implementado, via
  `colorScheme` do preset + `darkModeSelector`, sem degradar contraste.

---

## 16. Requisitos para eventual operação comercial (fora desta fase)

Nada nesta spec habilita dinheiro real. Antes de qualquer operação
comercial, etapa separada exigindo: parecer jurídico por jurisdição;
licenças/autorizações e regras de publicidade; entidade operadora,
termos e política de privacidade; KYC/AML, sanções, proteção de
menores; provedor de pagamento que aceite formalmente a atividade;
custódia, segregação e reconciliação de fundos; auditoria de segurança
independente; revisão do modelo de resolução e contestação; aprovação
formal técnica, jurídica e de risco. Pix, depósitos, saques e ativos
digitais permanecem desabilitados até conclusão dessas revisões.

---

## 17. Estratégia de testes

| Camada | Escopo |
| --- | --- |
| Unitários (Vitest) | Prioridade preço-tempo; matching parcial/total; reservas/liberação; arredondamento/tick; custo médio; liquidação idempotente; máquina de estados de mercado; formatação `Intl` por locale; chaves i18n completas. |
| Integração (Vitest + Supabase local/Testcontainers) | Ordem→ledger→posição→trade consistentes; concorrência no mesmo nível de preço; cancelamento × execução simultâneos; replay idempotente; rejeição em mercado pausado/fechado; isolamento RLS entre usuários; bloqueio de endpoints admin para `user`; reconciliação detectando divergência injetada. |
| E2E (Playwright, desktop + mobile) | Redirect `/`→locale; troca de idioma preservando contexto; signup/login/logout/reset; explorar e abrir mercado; criar/executar/cancelar ordem; carteira/posições/histórico; admin cria→publica→resolve mercado; acesso negado a `/admin` sem papel; navegação por teclado; avisos de demonstração visíveis. |
| Segurança/carga | Payloads malformados; tentativa de alterar `user_id`/role/saldo; rate limits; volume de eventos Realtime e reconexão; ausência de `service_role` no bundle; revisão manual de RLS. |

Infra existente: Vitest 5 (node) + Playwright (porta 3100) já
configurados; `@nuxtjs/test-utils` disponível para testes de
componente/ambiente Nuxt a partir da Fase 1. **Os testes configurados
ainda não foram executados** — a Fase 0 inclui a primeira corrida.

---

## 18. Etapas de implementação

| Fase | Objetivo | Critério de saída verificável |
| --- | --- | --- |
| 0 — Fundação e normalização | Normalizar git; corrigir links do README; executar testes existentes; Supabase local + `.env.example`; CI (lint, typecheck, unit, build); ADRs D-01…D-12 propostos. | Instalação limpa reproduz lint/testes/build; Supabase local sobe; nenhum segredo no repo; ADRs registrados para aceite. |
| 1 — UI base + i18n | PrimeVue + preset Perdiz; camadas CSS + `tailwindcss-primeui`; `@nuxtjs/i18n` com 4 prefixos; layout base, `LocaleSwitcher`, `SimulationBanner`; traduções de interface; testes de chaves e redirects. | Navegação localizada sem loop em SSR; zero chaves ausentes; componentes PrimeVue tematizados com tokens Perdiz. |
| 2 — Auth e papéis | Clientes Supabase (SSR); login/cadastro/reset; `profiles`, `user_roles`, preferências; middlewares; RLS inicial. | Usuário acessa só o próprio; papel não é autoatribuível; testes de autorização passam. |
| 3 — Mercados e catálogo | Migrations de mercados/categorias/traduções/outcomes; listagem, busca, filtros, detalhe; admin de rascunho→publicação; seeds fictícios. | Mercado criado no admin aparece localizado e publicável. |
| 4 — Ledger e carteira | Contas, transações balanceadas, saldo inicial, extrato, projeções, reconciliação v1. | Toda mutação de saldo rastreável e somando zero; saldo nunca negativo sob concorrência. |
| 5 — Livro de ordens | Funções SQL de matching/reserva/cancel; endpoints; UI livro+ticket; testes de concorrência e idempotência. | Cenários de concorrência sem saldo negativo nem execução dupla; book e posições convergem. |
| 6 — Realtime | Canais públicos/privados; atualização de book/trades/status; reconexão + snapshot. | UI converge ao estado do banco após desconexão/eventos repetidos. |
| 7 — Resolução e admin completo | Proposta/aprovação, evidência, liquidação idempotente, cancelamento/reversão; dashboard, usuários, auditoria. | Resolução aplicada uma única vez; trilha completa consultável; papéis respeitados. |
| 8 — Hardening | RLS/Storage/Realtime revisados; E2E completo; acessibilidade; carga básica; backup/restore; avisos legais; verificação de que pagamentos reais não são ativáveis. | Protótipo demonstrável; checklist de segurança aprovado; zero endpoints de dinheiro real. |

---

## 19. Decisões pendentes (ADRs a produzir na Fase 0)

| ID | Decisão | Por que importa |
| --- | --- | --- |
| D-01 | Tick size e faixa de preço por tipo de mercado | Determina constraints de `orders` e validações. |
| D-02 | Unidade de demonstração, precisão, arredondamento | Invariantes do ledger; separação por ambiente; sem conversão implícita. |
| D-03 | Saldo inicial e política de reset de demonstração | Emissão fictícia auditável; anti-abuso. |
| D-04 | Modelo de reserva, origem/lastro de posições vendáveis e política de cancelamento de mercado | Sem lastro definido, venda descoberta entraria por conveniência — proibido. |
| D-05 | Self-trade prevention e mapa de tokens Perdiz→PrimeVue | Comportamento do matching; consistência visual. |
| D-06 | Tema escuro e limites por usuário/ordem/mercado | Configuração do preset; anti-spam de ordens. |
| D-07 | `@nuxtjs/supabase` vs. `@supabase/ssr` manual | Interação com i18n customizado e controle de clientes. |
| D-08 | Gráficos: `Chart`/Chart.js vs. componente próprio | Custo de bundle vs. velocidade de entrega. |
| D-09 | Estratégia Realtime: canais, frequência, agregação | Limites de publicação e carga. |
| D-10 | Retenção de auditoria e dados pessoais | Conformidade e limpeza. |
| D-11 | Consolidar `docs `/`docs` e política de versionamento de ADRs | Higiene documental; links do README. |
| D-12 | Deploy, ambientes, backup/restore/rollback | Operação do protótipo. |

---

## 20. Riscos principais

| Risco | Mitigação |
| --- | --- |
| Divergência entre book, posições e ledger sob concorrência | Transações SQL únicas, locks, constraints, reconciliação, testes de corrida. |
| Conflito de especificidade PrimeVue × Tailwind | `cssLayer` do tema, `pt` localizado, proibição de overrides globais `p-*` e `!`. |
| Loop/falha de redirect i18n em SSR com prefixos customizados | `redirectOn` correto (v10), cookie, testes E2E de redirect nos 4 locales + idioma não suportado. |
| Interferência do módulo Supabase com redirects i18n | ADR D-07 com recomendação de integração manual. |
| Vazamento de `service_role` ou PII via Realtime/bundle | Separação de clientes, payloads mínimos, teste de bundle, revisão RLS. |
| Confusão "simulação × dinheiro real" | Avisos persistentes, unidade própria, zero endpoints de pagamento, revisão de textos na Fase 8. |
| Dois diretórios `docs`/`docs ` confundindo contribuidores | ADR D-11 + correção do README na Fase 0. |
| Versões novinhas (ex.: major recente) com bugs não maduros | Fixar versões ≥7 dias, `save-exact`, lockfile, validação na instalação. |

---

## 21. Critérios gerais de aceite da plataforma

- Todas as páginas funcionam nos quatro prefixos; detecção sem loop;
  troca manual persistente.
- Nenhuma chave privilegiada no bundle cliente; RLS cobre dados
  privados; ações críticas validadas no servidor.
- Matching transacional, determinístico, idempotente e coberto por
  testes de concorrência; livro-razão balanceado e reconciliável.
- Resolução aplica-se uma única vez; cancelamento segue política
  documentada.
- Avisos de demonstração onipresentes; zero rotas operacionais de
  depósito/saque/Pix.
- CI verde: lint, typecheck, unit, integration, build; E2E dos fluxos
  principais.
- Painel admin com autorização server-side e trilha de auditoria
  consultável.

---

## 22. Próximo passo

Esta spec aguarda **revisão e aprovação explícita**. Após aprovação:
produzir os ADRs D-01…D-12 (Fase 0) e derivar as tasks de
implementação. Nenhuma task, código ou migration foi criada nesta
etapa.
