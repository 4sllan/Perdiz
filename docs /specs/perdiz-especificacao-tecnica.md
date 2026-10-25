# Perdiz --- Especificação Funcional e Técnica

**Versão:** 1.0\
**Data:** 24 de outubro de 2026\
**Status:** Especificação inicial para protótipo\
**Produto:** Plataforma independente de mercados de previsão\
**Stack principal:** Nuxt 4, Vue 3, TypeScript, Tailwind CSS 4, Supabase e PostgreSQL

## Documentos de execução

- [Processo SDD](../../.devin/sdd.md): fluxo de desenvolvimento,
  decisões, padrão das tarefas e critérios de prontidão e conclusão.
- [Backlog de implementação](../tasks/perdiz-tasks.md): tarefas das
  fases 0 a 8, dependências, critérios de aceite, testes e
  rastreabilidade dos requisitos desta especificação.

Os documentos de execução não substituem os requisitos abaixo nem
representam funcionalidades já implementadas.

------------------------------------------------------------------------

## 1. Visão geral

A Perdiz é uma plataforma independente de mercados de previsão,
inspirada nos padrões de experiência comuns nesse segmento, mas com
marca, identidade visual, arquitetura e implementação próprias. O
produto permite explorar eventos, consultar probabilidades, negociar
posições simuladas por meio de um livro de ordens e acompanhar o
resultado de mercados.

A primeira versão será um **protótipo funcional com dinheiro fictício**.
Não haverá depósitos, saques, Pix, criptoativos ou movimentação de
dinheiro real. A arquitetura deve impedir que o modo de demonstração
seja confundido com uma operação financeira real.

### 1.1 Objetivos

- Criar uma experiência responsiva para desktop, tablet e dispositivos
  móveis.
- Implementar mercados binários (por exemplo, Sim/Não) e deixar a
  modelagem preparada para múltiplos resultados.
- Implementar livro de ordens e execução simulada de ordens.
- Atualizar cotações, livro de ordens, negociações e status em tempo
  real.
- Suportar rotas localizadas `/br/`, `/us/`, `/pt/` e `/es/`.
- Disponibilizar autenticação, perfil, carteira fictícia, posições e
  histórico.
- Incluir painel administrativo desde o início.
- Manter segurança, trilha de auditoria, testes automatizados e
  migrações versionadas.
- Deixar explícitas as fronteiras entre protótipo e eventual operação
  comercial futura.

### 1.2 Fora do escopo da primeira versão

- Depósitos, saques, Pix ou qualquer integração com pagamentos reais.
- Negociação com dinheiro real, ativos digitais ou promessa de
  resgate.
- Custódia de fundos de usuários.
- Integração com blockchain.
- Aplicativos nativos para iOS/Android.
- Garantia de liquidez ou execução de ordens reais.
- Abertura pública irrestrita antes da revisão de segurança e
  jurídica.

## 2. Princípios do produto

1. **Simulação explícita:** exibir aviso persistente de que saldos e
   operações são fictícios.
2. **Fonte de verdade no servidor:** preços, saldos, ordens,
   negociações e liquidações nunca são confiados ao navegador.
3. **Consistência financeira:** cada operação que altera saldo ou
   posição deve ser atômica e auditável.
4. **Idempotência:** reenvios de comandos não podem duplicar operações.
5. **Separação de responsabilidades:** interface, API, motor de ordens
   e liquidação devem ser módulos separados.
6. **Internacionalização real:** idioma, país, moeda de exibição e
   permissões regionais são conceitos distintos.
7. **Acessibilidade:** navegação por teclado, foco visível, contraste
   adequado e mensagens de erro compreensíveis.
8. **Segurança por padrão:** acesso mínimo necessário, RLS, validação
   no servidor e segredos fora do cliente.

## 3. Idiomas, países e URLs

### 3.1 URLs obrigatórias

- Brasil / português brasileiro: `perdiz.com/br/`
- Estados Unidos / inglês: `perdiz.com/us/`
- Portugal / português europeu: `perdiz.com/pt/`
- Espanha / espanhol: `perdiz.com/es/`

Os prefixos são códigos de locale definidos pelo produto, não
necessariamente códigos ISO de idioma. O mapeamento recomendado é:

  --------------------------------------------------------------------------
  Prefixo        Locale         Idioma         Região padrão  Moeda de
                                                              exibição
                                                              inicial
  -------------- -------------- -------------- -------------- --------------
  `br`           `pt-BR`        Português      Brasil         BRL
                                brasileiro                    

  `us`           `en-US`        Inglês         Estados Unidos USD
                                americano                     

  `pt`           `pt-PT`        Português      Portugal       EUR
                                europeu                       

  `es`           `es-ES`        Espanhol       Espanha        EUR
  --------------------------------------------------------------------------

A moeda acima é uma preferência de apresentação para o protótipo, não
uma conversão de saldo nem uma indicação de disponibilidade de operações
reais. A carteira fictícia deve manter unidade e origem bem definidas.

### 3.2 Detecção automática

- Ao acessar `/`, o servidor deve considerar `Accept-Language` e, se
  disponível, a preferência salva pelo usuário.
- A preferência explícita salva pelo usuário tem prioridade sobre a
  detecção do navegador.
- Redirecionar para um prefixo suportado; usar `/br/` como fallback
  inicial.
- Não redirecionar repetidamente rotas que já possuem prefixo.
- Preservar caminho e query string ao redirecionar, quando válido.
- Permitir troca manual de idioma no seletor global.
- Após login, sincronizar a preferência salva no perfil com a
  preferência local, seguindo uma regra de precedência documentada.
- Não inferir país ou elegibilidade jurídica somente pelo idioma do
  navegador.

### 3.3 Implementação Nuxt i18n

Usar `@nuxtjs/i18n` com prefixo obrigatório para todas as rotas
localizadas. Configurar `br`, `us`, `pt` e `es` como locales explícitos,
com arquivos de tradução próprios.

Exemplo conceitual de configuração:

``` ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    strategy: 'prefix',
    defaultLocale: 'br',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'perdiz_locale',
      redirectOn: 'root',
      alwaysRedirect: false,
    },
    locales: [
      { code: 'br', language: 'pt-BR', file: 'br.json', name: 'Português (Brasil)' },
      { code: 'us', language: 'en-US', file: 'us.json', name: 'English (US)' },
      { code: 'pt', language: 'pt-PT', file: 'pt.json', name: 'Português (Portugal)' },
      { code: 'es', language: 'es-ES', file: 'es.json', name: 'Español' },
    ],
  },
})
```

A configuração exata deve ser validada contra a versão instalada do
módulo. A rota raiz deve ter comportamento de redirecionamento testado
no SSR, sem causar loops.

### 3.4 Regras de tradução

- Não concatenar frases traduzidas a partir de fragmentos quando isso
  prejudicar a gramática.
- Usar chaves semânticas, por exemplo `market.order.buy`,
  `wallet.demoBalance` e `admin.market.publish`.
- Usar pluralização e interpolação do sistema i18n.
- Datas, números e moedas devem usar `Intl.DateTimeFormat` e
  `Intl.NumberFormat` conforme o locale.
- Não traduzir identificadores internos, IDs, nomes de usuário ou
  conteúdo escrito pelos usuários automaticamente.
- O conteúdo de mercados deve ter traduções e estado de publicação por
  locale; se uma tradução não existir, usar fallback claramente
  indicado.
- Incluir teste que detecte chaves ausentes e arquivos JSON inválidos.

## 4. Stack e arquitetura

### 4.1 Tecnologias

- **Nuxt 4 + Vue 3 + TypeScript:** interface, SSR, rotas, layouts e
  endpoints server-side.
- **Tailwind CSS 4:** estilos utilitários e tokens de tema via CSS,
  integrado ao Vite com `@tailwindcss/vite`, conforme orientação do responsável.
- **Supabase Auth:** cadastro, login, recuperação de senha e sessões.
- **Supabase PostgreSQL:** fonte de verdade para usuários, mercados,
  ordens, negociações, posições e livro-razão fictício.
- **Supabase Realtime:** distribuição de atualizações públicas e
  autorizadas.
- **Supabase Storage:** imagens de categorias e mercados, com
  políticas de acesso.
- **Supabase CLI:** migrações e ambiente local.
- **Vitest:** testes unitários e de componentes.
- **Playwright:** testes end-to-end.
- **ESLint e Prettier:** qualidade e padronização.
- **pnpm:** gerenciador de pacotes recomendado; fixar versões e manter
  lockfile.

### 4.2 Diagrama lógico

``` text
Navegador
   |
   v
Nuxt 4 (SSR + páginas + API server-side)
   |                  \
   |                   \--> Supabase Auth
   v
Serviços de domínio no servidor
   |
   +--> Mercados e resolução
   +--> Motor de ordens simulado
   +--> Livro-razão fictício
   +--> Administração e auditoria
   |
   v
PostgreSQL / Supabase
   |
   +--> Transações atômicas e constraints
   +--> RLS para acesso a dados
   +--> Outbox/eventos para atualizações
   |
   v
Supabase Realtime (eventos autorizados)
```

O navegador nunca deve chamar uma operação privilegiada que altere
saldos ou execute ordens sem passar por uma validação confiável no
servidor. A chave `service_role` nunca pode ser exposta ao cliente.

### 4.3 Organização de diretórios sugerida

``` text
perdiz/
├── app/
│   ├── assets/
│   ├── components/
│   │   ├── app/
│   │   ├── markets/
│   │   ├── orderbook/
│   │   ├── trading/
│   │   ├── wallet/
│   │   └── navigation/
│   ├── composables/
│   ├── layouts/
│   ├── middleware/
│   ├── pages/
│   │   ├── index.vue
│   │   ├── markets/
│   │   ├── events/
│   │   ├── portfolio/
│   │   ├── activity/
│   │   ├── wallet/
│   │   ├── profile/
│   │   └── admin/
│   └── utils/
├── i18n/
│   └── locales/
│       ├── br.json
│       ├── us.json
│       ├── pt.json
│       └── es.json
├── server/
│   ├── api/
│   ├── middleware/
│   ├── services/
│   │   ├── auth/
│   │   ├── markets/
│   │   ├── orderbook/
│   │   ├── trading/
│   │   ├── ledger/
│   │   ├── settlement/
│   │   └── admin/
│   ├── repositories/
│   ├── schemas/
│   └── utils/
├── shared/
│   ├── types/
│   └── constants/
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── config.toml
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── nuxt.config.ts
├── package.json
└── README.md
```

Não é necessário criar todos os diretórios vazios no primeiro commit. A
estrutura deve evoluir conforme os módulos forem implementados.

## 5. Módulos funcionais

### 5.1 Página inicial e exploração

- Listar mercados em destaque, recentes, populares e próximos do
  encerramento.
- Categorias: política, economia, esportes, tecnologia, cultura e
  outras configuráveis.
- Busca por título, descrição, categoria e tags.
- Filtros por estado, categoria, data de encerramento e volume
  simulado.
- Ordenação por atividade, probabilidade, volume fictício e
  encerramento.
- Paginação ou carregamento incremental com limites.
- Exibir aviso "Modo demonstração --- sem dinheiro real".
- Estados de carregamento, lista vazia, falha e indisponibilidade.

### 5.2 Página do mercado

- Título, descrição, categoria, imagem e estado.
- Resultados possíveis e preços/probabilidades indicativos.
- Gráfico histórico baseado em negociações simuladas.
- Livro de ordens com ofertas de compra e venda.
- Volume e liquidez identificados como simulados.
- Regras de resolução, fonte de referência e data de encerramento.
- Histórico recente de negociações, sem expor dados privados.
- Área para criar ordem, consultar posições e cancelar ordens abertas.
- Indicar claramente que probabilidade/preço não representa certeza do
  resultado.

### 5.3 Tipos de mercado

Na primeira fase, implementar mercados binários com resultados como
`YES` e `NO`. A modelagem pode permitir múltiplos resultados, mas a
negociação multirresultado só será habilitada após testes específicos.

Estados do mercado:

- `draft`: rascunho.
- `review`: aguardando revisão administrativa.
- `open`: aceita ordens simuladas.
- `paused`: temporariamente suspenso.
- `closed`: não aceita novas ordens.
- `resolving`: resultado em análise.
- `resolved`: resultado final registrado.
- `cancelled`: cancelado; exige política definida de
  liberação/reversão simulada.

Toda transição deve ser validada no servidor e registrada na auditoria.

### 5.4 Livro de ordens

O motor de negociação será de livro de ordens centralizado e
**inteiramente simulado**.

Tipos de ordem para o protótipo: - Ordem limitada. - Compra e venda de
posições existentes. - Cancelamento de ordem aberta. - Execução parcial
e total. - Expiração opcional de ordens. - Histórico de ordens e
negociações.

Regras: - Prioridade preço-tempo: melhor preço primeiro; em igualdade de
preço, ordem mais antiga primeiro. - A execução deve ocorrer dentro de
uma transação de banco de dados. - O saldo fictício necessário deve ser
reservado ao aceitar uma ordem. - Cancelamento deve liberar apenas o
saldo ainda reservado e não executado. - Execução parcial deve atualizar
ordem, reserva, posições e lançamentos de forma consistente. - Uma ordem
não pode executar contra ela própria, caso a política anti-self-trade
esteja habilitada; definir a regra antes da implementação. - Definir
ticks de preço, quantidade mínima e limites máximos por ordem. - O motor
deve rejeitar preço fora do intervalo configurado e quantidade
inválida. - A UI não deve determinar o preço final executado nem o saldo
final. - O algoritmo deve ser determinístico e coberto por testes de
prioridade, concorrência e idempotência.

Para um protótipo inicial, o matching pode ser implementado como serviço
server-side com funções PostgreSQL transacionais. Evitar manter o
matching crítico exclusivamente em memória, pois isso pode causar
divergência entre instâncias. Se o volume de eventos crescer, avaliar um
serviço dedicado de matching, mantendo o PostgreSQL como fonte de
verdade.

### 5.5 Conta e perfil

- Cadastro e login por e-mail e senha via Supabase Auth.
- Verificação de e-mail e recuperação de senha.
- Logout e gerenciamento básico de sessão.
- Nome público, avatar e preferências.
- Preferência de idioma e região.
- Histórico pessoal de ordens, negociações e posições.
- Encerramento de sessão e tratamento de conta suspensa.
- Nunca armazenar senhas em tabelas próprias.

### 5.6 Carteira fictícia

- Criar saldo de demonstração inicial configurável.
- Mostrar saldo disponível, saldo reservado e valor de posições
  separadamente.
- Permitir consultar extrato e lançamentos simulados.
- Permitir reiniciar saldo somente por fluxo controlado, com limites e
  auditoria.
- Não permitir transferências entre usuários na primeira versão.
- Não apresentar o saldo fictício como resgatável, conversível ou
  equivalente a dinheiro.
- Não criar botões funcionais de depósito, saque ou Pix no protótipo.
  Se aparecerem em mockups, devem estar desabilitados e identificados
  como "Indisponível no protótipo".

### 5.7 Posições e liquidação simulada

- Calcular posições a partir das negociações confirmadas.
- Mostrar custo médio, quantidade, valor estimado e histórico.
- Ao resolver mercado, bloquear novas ordens e iniciar processo
  idempotente de liquidação.
- Resultado deve ser confirmado por um administrador autorizado e,
  idealmente, revisado por outro administrador para eventos sensíveis.
- Guardar fonte de resolução, evidência, horário, autor e motivo.
- Calcular resultado simulado conforme regras publicadas do mercado.
- Se houver cancelamento, executar política explícita de
  reversão/liberação de reservas.
- Uma liquidação repetida não pode creditar resultados duas vezes.

### 5.8 Notificações e tempo real

- Atualizar livro de ordens, últimas negociações, estado do mercado e
  posição do próprio usuário.
- Usar Supabase Realtime apenas para eventos necessários, evitando
  enviar dados privados a canais públicos.
- Tratar reconexão, eventos repetidos, eventos fora de ordem e
  atualização completa após reconectar.
- A mensagem de tempo real é uma notificação; a consulta autorizada ao
  servidor/banco continua sendo a fonte de verdade.
- Não transmitir e-mail, dados pessoais, saldo privado ou detalhes de
  ordens privadas em broadcast público.
- Definir limites de frequência e estratégia de agrupamento de
  atualizações para evitar sobrecarga.

### 5.9 Painel administrativo

O painel administrativo faz parte do MVP, com acesso protegido por
autorização server-side e papel administrativo verificado no banco.

Funcionalidades: - Dashboard com métricas simuladas: usuários, mercados
ativos, ordens, negociações e volume fictício. - CRUD de categorias,
tags e mercados. - Revisão e publicação de mercados. - Pausar, encerrar,
resolver ou cancelar mercados conforme permissões. - Registrar fontes e
critérios de resolução. - Gerenciar conteúdo localizado e traduções. -
Consultar usuários e suspender contas segundo política definida. -
Consultar ordens e negociações para suporte e auditoria. - Consultar
trilha de auditoria. - Configurar parâmetros de demonstração, como saldo
inicial e limites. - Visualizar erros de processamento sem expor
segredos.

Controles: - Papel administrativo não pode ser definido pelo próprio
usuário nem confiado a metadados editáveis pelo cliente. - Operações
críticas exigem confirmação, motivo e registro de auditoria. - Separar
permissões de editor de conteúdo, moderador, resolvedor e administrador
total quando necessário. - Não permitir que administradores alterem
diretamente lançamentos financeiros existentes; correções devem ser
lançamentos compensatórios auditados. - Ações de resolução devem exigir
justificativa e registrar a evidência usada.

## 6. Modelo de dados PostgreSQL

Os nomes abaixo são uma proposta inicial. Todas as tabelas devem ter
chaves, índices, constraints, políticas RLS e migrações versionadas.
Ajustar os tipos e relações antes da primeira migração.

### 6.1 Entidades

#### `profiles`

- `id uuid primary key references auth.users(id)`
- `display_name text`
- `avatar_path text null`
- `locale text not null default 'br'`
- `region text not null default 'br'`
- `created_at timestamptz`
- `updated_at timestamptz`

#### `user_roles`

- `user_id uuid references auth.users(id)`
- `role text check (...)`
- `created_at timestamptz`
- Chave primária composta (`user_id`, `role`).
- Valores iniciais possíveis: `user`, `content_editor`, `moderator`,
  `market_resolver`, `admin`.

A atribuição de papéis só pode ser feita por fluxo privilegiado
autorizado e auditado.

#### `categories`

- `id uuid primary key`
- `slug text unique`
- `icon text null`
- `sort_order int`
- `is_active boolean`
- `created_at timestamptz`

#### `category_translations`

- `category_id uuid references categories(id)`
- `locale text`
- `name text`
- `description text null`
- Chave primária composta (`category_id`, `locale`).

#### `markets`

- `id uuid primary key`
- `slug text unique`
- `category_id uuid references categories(id)`
- `status text check (...)`
- `market_type text check (...)`
- `opens_at timestamptz`
- `closes_at timestamptz`
- `resolved_at timestamptz null`
- `resolution_outcome_id uuid null`
- `created_by uuid`
- `created_at timestamptz`
- `updated_at timestamptz`
- `version bigint not null default 1`

#### `market_translations`

- `market_id uuid references markets(id)`
- `locale text`
- `title text`
- `description text`
- `resolution_rules text`
- `resolution_source_url text null`
- Chave primária composta (`market_id`, `locale`).

#### `market_outcomes`

- `id uuid primary key`
- `market_id uuid references markets(id)`
- `outcome_key text`
- `sort_order int`
- `is_winner boolean null`
- Unique (`market_id`, `outcome_key`).

#### `orders`

- `id uuid primary key`
- `user_id uuid`
- `market_id uuid`
- `outcome_id uuid`
- `side text check (side in ('buy','sell'))`
- `order_type text check (order_type in ('limit'))`
- `price numeric(12,6) check (price > 0 and price < 1)` para mercados
  binários normalizados
- `quantity numeric(20,8) check (quantity > 0)`
- `remaining_quantity numeric(20,8)`
- `status text check (...)`
- `idempotency_key text`
- `created_at timestamptz`
- `updated_at timestamptz`
- Unique (`user_id`, `idempotency_key`).

Os limites de preço devem ser configuráveis por tipo de mercado; não
assumir que toda estrutura futura usa a faixa de 0 a 1.

#### `trades`

- `id uuid primary key`
- `market_id uuid`
- `outcome_id uuid`
- `buy_order_id uuid`
- `sell_order_id uuid`
- `buyer_id uuid`
- `seller_id uuid`
- `price numeric(12,6)`
- `quantity numeric(20,8)`
- `executed_at timestamptz`
- `simulation boolean not null default true`

#### `ledger_accounts`

- `id uuid primary key`
- `owner_user_id uuid null`
- `account_type text`
- `unit_code text not null`
- `created_at timestamptz`

#### `ledger_transactions`

- `id uuid primary key`
- `idempotency_key text unique`
- `transaction_type text`
- `reference_type text`
- `reference_id uuid null`
- `status text`
- `created_at timestamptz`
- `metadata jsonb` com lista de campos permitidos, sem segredos.

#### `ledger_entries`

- `id uuid primary key`
- `transaction_id uuid references ledger_transactions(id)`
- `account_id uuid references ledger_accounts(id)`
- `amount numeric(24,8) not null`
- `created_at timestamptz`

Usar partidas dobradas: cada transação contabilizada deve ter soma de
lançamentos igual a zero dentro da mesma unidade monetária/unidade de
demonstração. Validar a regra em uma função transacional ou mecanismo
equivalente. Lançamentos contabilizados não devem ser editados nem
apagados; erros devem ser corrigidos por transação compensatória.

#### `positions`

- `id uuid primary key`
- `user_id uuid`
- `market_id uuid`
- `outcome_id uuid`
- `quantity numeric(20,8)`
- `average_cost numeric(12,6)`
- `updated_at timestamptz`
- Unique (`user_id`, `market_id`, `outcome_id`).

A posição pode ser uma projeção atualizada transacionalmente a partir de
trades e lançamentos. Deve ser possível reconciliá-la com o histórico de
negociações.

#### `market_resolutions`

- `id uuid primary key`
- `market_id uuid`
- `outcome_id uuid null`
- `resolution_status text`
- `source_url text null`
- `evidence jsonb`
- `reason text`
- `proposed_by uuid`
- `approved_by uuid null`
- `created_at timestamptz`
- `finalized_at timestamptz null`

#### `audit_logs`

- `id uuid primary key`
- `actor_user_id uuid null`
- `action text`
- `entity_type text`
- `entity_id uuid null`
- `reason text null`
- `request_id text null`
- `metadata jsonb`
- `created_at timestamptz`

#### `user_preferences`

- `user_id uuid primary key`
- `locale text`
- `display_currency text`
- `timezone text null`
- `updated_at timestamptz`

#### `favorites`

- `user_id uuid`
- `market_id uuid`
- `created_at timestamptz`
- Primary key (`user_id`, `market_id`).

### 6.2 Regras de integridade

- Usar `numeric`, nunca `float`/`real`, para valores e quantidades
  financeiras.
- Definir escala, arredondamento e unidade de cada campo.
- Usar UTC no banco e converter para locale apenas na apresentação.
- Aplicar foreign keys e índices em colunas de busca e relacionamento.
- Impedir quantidades negativas quando a regra de negócio não as
  permitir.
- Definir transições de estado válidas por função de domínio.
- Usar transações SQL para matching, reserva, execução, cancelamento e
  liquidação.
- Usar chave de idempotência em comandos que podem ser repetidos.
- Criar rotina de reconciliação entre ordens, trades, posições e
  livro-razão.
- Não armazenar dados de cartão ou credenciais de pagamento no
  protótipo.

## 7. API e serviços de domínio

As rotas abaixo são sugestões de endpoints Nuxt server-side. A
nomenclatura pode ser adaptada, mantendo contratos claros e
versionáveis.

### Público

- `GET /api/markets`
- `GET /api/markets/:slug`
- `GET /api/markets/:id/orderbook`
- `GET /api/markets/:id/trades`
- `GET /api/categories`

### Autenticado

- `GET /api/me`
- `GET /api/me/portfolio`
- `GET /api/me/orders`
- `GET /api/me/trades`
- `GET /api/me/ledger`
- `POST /api/markets/:id/orders`
- `POST /api/orders/:id/cancel`
- `POST /api/me/favorites`
- `DELETE /api/me/favorites/:marketId`

### Administração

- `GET /api/admin/dashboard`
- `POST /api/admin/markets`
- `PATCH /api/admin/markets/:id`
- `POST /api/admin/markets/:id/publish`
- `POST /api/admin/markets/:id/pause`
- `POST /api/admin/markets/:id/resolve`
- `POST /api/admin/markets/:id/cancel`
- `GET /api/admin/audit-logs`

### Contrato de criação de ordem

O servidor deve validar: - sessão e status da conta; - permissão para
negociar no modo de demonstração; - mercado aberto e dentro do período
permitido; - resultado pertencente ao mercado; - lado, preço, quantidade
e precisão; - limites por usuário, mercado e ordem; - saldo/reserva
suficiente; - chave de idempotência; - prevenção de concorrência e
execução duplicada.

A resposta deve incluir IDs, estado da ordem, quantidades executadas e
restantes, saldo atualizado e identificador da operação. Nunca aceitar
do cliente saldo final, preço de execução final ou resultado de mercado.

Erros devem usar códigos previsíveis, sem revelar detalhes internos ou
dados de outros usuários.

## 8. Segurança e privacidade

### 8.1 Autenticação e autorização

- Usar Supabase Auth para identidade e sessão.
- Verificar sessão e permissões em cada endpoint privado.
- Aplicar autorização por papel no servidor.
- Não confiar em `user_id`, `role`, preço, saldo ou status enviados
  pelo navegador.
- Impedir elevação de privilégios por alteração de metadados
  controlados pelo usuário.
- Proteger rotas administrativas por middleware de interface e por
  validação server-side; o middleware de UI sozinho não é controle de
  segurança.

### 8.2 RLS

Habilitar RLS nas tabelas expostas ao cliente. A política padrão é negar
acesso até existir uma política explícita.

- Perfil: usuário lê e atualiza somente os campos permitidos do
  próprio perfil.
- Ordens: usuário lê apenas suas ordens; inserções/alterações críticas
  passam pelo servidor.
- Trades: usuários podem consultar trades públicos sem dados pessoais;
  informações privadas são restritas.
- Ledger e posições: somente o titular pode consultar seus dados,
  conforme política.
- Administração: acesso condicionado a papel verificado em fonte
  protegida.
- Mercados publicados e traduções públicas: leitura pública apenas
  para registros publicados.
- Logs de auditoria: acesso administrativo restrito.
- Nunca expor `service_role` no bundle do cliente.

### 8.3 Proteções adicionais

- Rate limiting em login, busca e criação/cancelamento de ordens.
- Validação de payload com schemas tipados.
- Proteção contra CSRF conforme estratégia de sessão/cookies adotada.
- CSP e cabeçalhos de segurança apropriados.
- Limites de tamanho e tipo de arquivos enviados.
- Logs sem tokens, senhas, cookies ou dados sensíveis.
- Monitoramento de erros e alertas.
- Política de retenção e exclusão de dados pessoais.
- Dependências auditadas e atualizadas.
- Segredos via variáveis de ambiente e gerenciador seguro em produção.
- Backup e teste de restauração.
- Revisão de permissões de Storage e Realtime.

### 8.4 Limites de simulação

- Identificar a aplicação como protótipo em toda a experiência de
  negociação.
- Não permitir configurar uma chave de produção que ative pagamentos
  reais sem revisão de código e implantação deliberada.
- Não criar endpoints de depósito/saque reais no protótipo.
- Manter flags de funcionalidade no servidor e por ambiente.
- Usar exclusivamente dados e saldo fictícios.
- Evitar mensagens que sugiram lucro garantido ou saldo resgatável.

## 9. Realtime

Eventos sugeridos: - `market.updated` - `orderbook.updated` -
`trade.created` - `order.updated` - `position.updated` -
`market.status_changed`

Regras: - Publicar somente o mínimo necessário para atualização da UI. -
Usar canais públicos apenas para dados públicos. - Restringir canais
privados e validar associação do usuário. - Incluir `event_id`,
`market_id`, `version` ou sequência monotônica quando útil. - Tratar
duplicação e eventos fora de ordem. - Após reconectar, buscar snapshot
atual por API e reconciliar a interface. - Não tratar entrega de evento
como confirmação financeira; a fonte de verdade é o banco. - Agrupar
atualizações de alta frequência quando necessário.

## 10. UX e identidade visual

A Perdiz deve ter marca e sistema visual próprios. A inspiração na
categoria não autoriza copiar logotipo, textos, ilustrações, layout
exato ou elementos proprietários de outra plataforma.

Direção inicial: - Interface moderna, focada em leitura de dados e
descoberta. - Hierarquia clara entre pergunta, probabilidades, gráfico e
ação. - Design responsivo com navegação adaptada a telas pequenas. -
Componentes consistentes para botões, tabelas, cards, modais,
formulários e notificações. - Estados de carregamento, erro, vazio,
sucesso e indisponibilidade. - Acessibilidade WCAG como objetivo de
projeto. - Tema claro/escuro pode ser configurável, sem comprometer
contraste. - Aviso persistente de simulação nas telas de carteira e
negociação. - Exibir claramente preço, quantidade, custo estimado, taxas
simuladas se houver e resultado potencial, sem promessas de retorno.

## 11. Observabilidade e operação

- Logs estruturados com `request_id` e identificadores de domínio.
- Métricas de latência de API, falhas de ordens, rejeições, reconexões
  e erros de liquidação.
- Alertas para falhas repetidas no matching ou inconsistência de
  livro-razão.
- Rotina de reconciliação periódica.
- Backups e testes de restauração.
- Ambientes separados: local, teste/staging e produção.
- Migrações aplicadas de forma controlada; não alterar schema de
  produção manualmente.
- Seeds de desenvolvimento claramente separados de dados reais.
- Documentar procedimentos de rollback e resposta a incidentes.

## 12. Estratégia de testes

### Unitários

- Cálculo de preço, quantidade e arredondamento.
- Prioridade preço-tempo.
- Matching total e parcial.
- Reserva e liberação de saldo fictício.
- Cálculo de posição e custo médio.
- Resolução e liquidação idempotente.
- Formatação de moeda, data e números por locale.
- Validação de transições de estado.

### Integração

- Criação de ordem e atualização consistente de ledger, posições e
  trades.
- Duas ordens concorrentes sobre o mesmo nível de preço.
- Cancelamento simultâneo à execução.
- Repetição do mesmo comando com chave idempotente.
- Mercado pausado/encerrado rejeita ordens.
- Usuário não consegue ler ledger ou ordens de outra pessoa.
- Usuário comum não consegue executar endpoints administrativos.
- RLS aplicada às tabelas expostas.
- Reconciliação identifica divergências introduzidas por testes.

### End-to-end

- Visitante entra em `/` e é direcionado ao locale correto.
- Troca de idioma preserva contexto quando existe tradução.
- Cadastro, login, logout e recuperação de senha.
- Explorar mercado e abrir página de detalhes.
- Criar ordem, visualizar execução e cancelar ordem restante.
- Ver carteira fictícia, posições e histórico.
- Administrador cria, revisa, publica, pausa e resolve um mercado.
- Usuário sem permissão recebe resposta adequada ao tentar acessar
  `/admin`.
- Layout funciona em desktop e mobile.
- Navegação por teclado e mensagens de erro são verificadas.

### Segurança e carga

- Testar abuso de endpoints e rate limits.
- Testar payloads inválidos e tentativas de alterar `user_id`, papel e
  saldo.
- Testar concorrência de ordens e idempotência.
- Testar volume de eventos Realtime e recuperação após desconexão.
- Fazer revisão manual das políticas RLS.
- Não considerar testes de UI como substitutos de testes de
  integridade no banco.

## 13. Etapas de implementação

### Fase 0 --- Fundação

- Criar repositório e projeto Nuxt 4 novo.
- Configurar TypeScript, lint, formatador e testes.
- Configurar Supabase local e ambientes.
- Definir variáveis de ambiente e documentação.
- Configurar CI para lint, testes e build.

**Critério de saída:** projeto instala, executa, testa e compila em
ambiente limpo.

### Fase 1 --- Design system e i18n

- Definir identidade visual da Perdiz.
- Criar layouts e componentes base.
- Configurar `/br/`, `/us/`, `/pt/` e `/es/`.
- Implementar detecção de idioma, cookie e seletor manual.
- Criar tradução de interface e testes de chaves.

**Critério de saída:** navegação localizada funciona sem loop e sem
chaves de tradução ausentes nas telas principais.

### Fase 2 --- Autenticação e autorização

- Configurar Supabase Auth.
- Criar perfil e preferências.
- Implementar guards de UI e validação server-side.
- Definir papéis administrativos e RLS.
- Testar acessos indevidos.

**Critério de saída:** usuário só acessa os dados autorizados e nenhum
papel privilegiado pode ser atribuído pelo cliente.

### Fase 3 --- Mercados e conteúdo

- Criar categorias, traduções, mercados e resultados.
- Implementar listagem, busca, filtros e detalhes.
- Criar fluxo administrativo de rascunho, revisão e publicação.
- Exibir regras e fonte de resolução.

**Critério de saída:** mercados podem ser criados, revisados, publicados
e exibidos por locale.

### Fase 4 --- Carteira fictícia e livro-razão

- Criar contas de ledger e lançamentos balanceados.
- Configurar saldo fictício inicial.
- Criar histórico e projeções de saldo disponível/reservado.
- Implementar reconciliação e idempotência.
- Bloquear transferências entre usuários.

**Critério de saída:** cada alteração de saldo tem origem rastreável e
as transações balanceiam.

### Fase 5 --- Livro de ordens e posições

- Implementar criação, reserva, matching, execução parcial e
  cancelamento.
- Implementar trades e posições.
- Tratar concorrência e falhas.
- Testar prioridade preço-tempo e operações repetidas.
- Mostrar estado de ordem e posição na UI.

**Critério de saída:** ordens concorrentes não geram saldo negativo nem
execução duplicada.

### Fase 6 --- Realtime

- Publicar eventos autorizados.
- Atualizar livro, trades e status.
- Implementar reconexão e snapshot de recuperação.
- Medir latência e carga.

**Critério de saída:** a UI converge para o estado do banco mesmo após
desconexões e eventos repetidos.

### Fase 7 --- Resolução e administração

- Implementar evidências e proposta de resolução.
- Implementar aprovação, liquidação e cancelamento idempotentes.
- Finalizar dashboard, gestão de usuários e auditoria.
- Testar permissões por papel.

**Critério de saída:** todas as ações críticas são autorizadas,
auditadas e reproduzíveis.

### Fase 8 --- Hardening do protótipo

- Revisar RLS e políticas de Storage/Realtime.
- Executar testes E2E, segurança e carga.
- Verificar acessibilidade, SEO e desempenho.
- Testar backup e restauração.
- Revisar mensagens legais e avisos de simulação.
- Confirmar que pagamentos reais não podem ser ativados
  acidentalmente.

**Critério de saída:** protótipo pronto para demonstração controlada,
ainda sem dinheiro real.

## 14. Critérios gerais de aceite

- Todas as páginas principais funcionam nos quatro prefixos de idioma.
- A detecção automática não causa loops e respeita preferência manual.
- Nenhuma chave privilegiada aparece no bundle do cliente.
- RLS protege todos os dados privados.
- Ações críticas são validadas no servidor.
- O matching é transacional, idempotente e coberto por testes de
  concorrência.
- O livro-razão fictício é balanceado e auditável.
- A resolução de um mercado não pode ser aplicada duas vezes.
- O painel administrativo verifica permissões no servidor.
- Eventos Realtime não vazam dados privados.
- O protótipo identifica claramente dinheiro fictício.
- Não existem endpoints operacionais de Pix, depósito ou saque real.
- CI executa lint, testes e build com sucesso.

## 15. Futuro comercial: bloqueios obrigatórios

Uma eventual versão comercial exige uma etapa separada de avaliação, sem
ativação automática a partir do protótipo.

Antes de qualquer operação real: - Obter parecer jurídico atualizado
para cada jurisdição e modalidade de mercado. - Determinar licenças,
autorizações, restrições de publicidade e regras de participação
aplicáveis. - Definir entidade operadora, termos, política de
privacidade e tratamento de reclamações. - Avaliar KYC/AML, sanções,
fraude, proteção de menores e limites territoriais conforme a lei
aplicável. - Contratar provedor de pagamento que aceite formalmente a
atividade e o fluxo de fundos. - Definir custódia, segregação,
reconciliação, tratamento de disputas e insolvência. - Fazer auditoria
de segurança independente. - Revisar modelo de liquidação, fontes de
resolução e mecanismo de contestação. - Aprovar formalmente a ativação
por responsáveis técnicos, jurídicos e de risco.

Pix, depósitos, saques, ativos digitais e negociação real devem
continuar desabilitados até que todas as revisões e autorizações
pertinentes estejam concluídas. A arquitetura de demonstração não
constitui autorização para operar comercialmente.

## 16. Decisões técnicas a validar antes da implementação

1. Faixa de preço e tick size para cada tipo de mercado.
2. Unidade de quantidade e regras de arredondamento.
3. Modelo de reserva de saldo para compras e vendas.
4. Política de autoexecução (self-trade prevention).
5. Limites de ordens por usuário e por mercado.
6. Tratamento de mercado cancelado e ordens abertas.
7. Fonte e aprovação de resultados.
8. Estratégia de Realtime e limites de publicação.
9. Política de saldo fictício e reinicialização.
10. Retenção de auditoria e dados pessoais.
11. Estratégia de deploy, backup e restauração.
12. Modelo de moeda: saldo de demonstração em unidades separadas por
    ambiente; nunca conversão implícita entre moedas.

Essas decisões devem ser documentadas em ADRs (Architecture Decision
Records) curtos e versionados antes de implementar as partes críticas.

------------------------------------------------------------------------

## 17. Resumo executivo

A primeira entrega da Perdiz será uma plataforma de demonstração com
identidade própria, Nuxt 4, Supabase, quatro locales, autenticação,
mercados, livro de ordens simulado, carteira fictícia, posições,
resolução e painel administrativo.

A prioridade de engenharia é garantir integridade e auditabilidade do
motor de ordens e do livro-razão, não apenas reproduzir a aparência de
uma plataforma de previsão. Qualquer caminho para dinheiro real deverá
ser tratado como projeto posterior, sujeito a revisão jurídica, de
segurança, pagamentos e operação.
