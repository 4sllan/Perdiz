# Perdiz - Backlog de implementação

**Base:** especificação funcional e técnica v1.0, de 24/10/2026.
**Estado:** PDZ-001 em andamento; demais tarefas pendentes.
**Método:** [SDD](../../.devin/sdd.md).
**Requisitos:** [especificação técnica](../specs/perdiz-especificacao-tecnica.md).

As tarefas seguem as fases 0 a 8 da seção 13. O status de cada ficha
reflete sua execução; dependências e ADRs aceitos são pré-condições,
não decisões já tomadas. Aplicar Definition of Ready e Definition of Done do SDD.
As evidências devem ser preenchidas durante a execução, não presumidas.

## Decisões obrigatórias

PDZ-002 deve produzir os ADRs abaixo. Cada ADR pode ser revisado e aceito
separadamente; tarefas dependem apenas das decisões indicadas em suas fichas.

| ADR planejado | Decisão da seção 16 | Bloqueia |
| --- | --- | --- |
| ADR-001 | Faixa de preço e tick size | PDZ-022 |
| ADR-002 | Unidade, precisão e arredondamento | PDZ-018, PDZ-022 |
| ADR-003 | Reserva de compras/vendas e origem/lastro das posições iniciais | PDZ-022 |
| ADR-004 | Prevenção de autoexecução | PDZ-023 |
| ADR-005 | Limites por usuário, mercado e ordem | PDZ-022 |
| ADR-006 | Cancelamento de mercados, ordens e reversões | PDZ-033 |
| ADR-007 | Fontes, aprovação de resultado e revisão por segundo responsável | PDZ-031 |
| ADR-008 | Estratégia Realtime e limites de publicação | PDZ-028 |
| ADR-009 | Saldo fictício inicial e reinicialização controlada | PDZ-019 |
| ADR-010 | Retenção de auditoria e dados pessoais | PDZ-012 |
| ADR-011 | Deploy, backup, restauração e rollback | PDZ-005, PDZ-037 |
| ADR-012 | Unidades de demonstração separadas por ambiente, sem conversão implícita | PDZ-018 |

O modelo inicial permite vender apenas posições existentes, mas não define
como elas passam a existir nem seu lastro. ADR-003 deve resolver essa lacuna
antes do motor de ordens; não introduzir venda descoberta ou crédito sem lastro
por conveniência de implementação.

## Fase 0 - Fundação

Saída: projeto instala, executa, testa e compila em ambiente limpo.

### PDZ-001 - Inicializar a aplicação e ferramentas

- Status: em andamento
- Fase: 0 - Fundação
- Origem: seções 4.1, 4.3 e 13/fase 0.
- Dependências: nenhuma.
- Entregáveis: Nuxt 4, Vue 3, TypeScript, Tailwind CSS 4 integrado ao Vite, pnpm com versões fixadas e lockfile; ESLint, Prettier, Vitest, Playwright e README.
- Aceite: estrutura mínima sem diretórios vazios desnecessários; comandos de desenvolvimento, lint, tipos, testes e build documentados e executáveis.
- Testes: instalação limpa, smoke de SSR, teste unitário e E2E mínimos, lint, tipos e build.
- Evidências: Nuxt 4.6.2, Vue 3.5.44, Tailwind CSS 4.3.3 via Vite e pnpm 11.18.0 com lockfile; `pnpm install`, `pnpm lint`, `pnpm typecheck` e `pnpm build` executados com sucesso. `pnpm dev` iniciado em http://127.0.0.1:3000. Arquivos principais: `package.json`, `nuxt.config.ts`, `app/pages/index.vue`, `app/assets/css/main.css`, `tests/` e `README.md`. Testes unitários/E2E configurados, mas não executados por orientação do responsável; Chromium não baixado. Instalação em ambiente limpo e validações de UI/testes permanecem pendentes; não marcar concluída.

### PDZ-002 - Formalizar as decisões técnicas pendentes

- Status: pendente
- Fase: 0 - Fundação
- Origem: seções 5.4, 5.7, 6.2 e 16.
- Dependências: nenhuma.
- Entregáveis: ADR-001 a ADR-012 com alternativas, impactos, tarefas afetadas e responsáveis pelo aceite.
- Aceite: todas as decisões da tabela possuem proposta; aceite é registrado explicitamente pelo responsável; divergências com requisitos são resolvidas na especificação.
- Testes: revisão documental de cobertura das 12 decisões e de consistência entre reserva, posições, matching, unidades e liquidação.
- Evidências: a preencher na execução.

### PDZ-003 - Configurar Supabase local e ambientes seguros

- Status: pendente
- Fase: 0 - Fundação
- Origem: seções 4, 8.3, 8.4, 11 e 13/fase 0.
- Dependências: PDZ-001.
- Entregáveis: configuração Supabase CLI, exemplo de variáveis sem valores secretos, separação local/staging/produção e documentação de setup.
- Aceite: ambiente local reproduzível; credenciais privilegiadas somente no servidor; flags não ativam pagamentos; seeds exclusivamente fictícios.
- Testes: inicialização/reset local, ausência de segredos no cliente e rejeição de configuração privilegiada pública.
- Evidências: a preencher na execução.

### PDZ-004 - Definir contratos e infraestrutura de testes

- Status: pendente
- Fase: 0 - Fundação
- Origem: seções 2, 4.2, 6.2, 7 e 12.
- Dependências: PDZ-001, PDZ-003.
- Entregáveis: limites entre API, serviços e repositórios; schemas tipados, erros previsíveis, request_id, fixtures e isolamento dos testes de banco.
- Aceite: contratos de API e idempotência documentados; dados de teste não atingem ambientes compartilhados; erro não revela detalhes internos.
- Testes: payload inválido, erro sanitizado, propagação de request_id e execução isolada das suítes.
- Evidências: a preencher na execução.

### PDZ-005 - Automatizar CI e preparar estratégia de implantação

- Status: pendente
- Fase: 0 - Fundação
- Origem: seções 11, 13/fase 0, 14 e 16.11.
- Dependências: PDZ-004; ADR-011 aceito.
- Entregáveis: pipeline de lint, tipos, unitários, integração, E2E e build; instruções de migração e implantação por ambiente.
- Aceite: pipeline reproduzível em checkout limpo, bloqueia falhas e não implanta nem altera produção implicitamente.
- Testes: execução completa em ambiente limpo e demonstração de que falha de teste bloqueia o pipeline.
- Evidências: a preencher na execução.

## Fase 1 - Design system e i18n

Saída: navegação localizada sem loops nem chaves ausentes nas telas principais.

### PDZ-006 - Criar identidade visual e componentes acessíveis

- Status: pendente
- Fase: 1 - Design system e i18n
- Origem: seções 2.1, 2.7, 5.1 e 10.
- Dependências: PDZ-001.
- Entregáveis: identidade própria, tokens, layouts responsivos, navegação, formulários, cards, tabelas, modais, notificações e aviso persistente de demonstração.
- Aceite: hierarquia visual consistente; estados de carregamento, erro, vazio e indisponibilidade; foco visível, contraste e uso por teclado.
- Testes: componentes, teclado/foco e visualização em mobile, tablet e desktop.
- Evidências: a preencher na execução.

### PDZ-007 - Implementar rotas localizadas e seleção de idioma

- Status: pendente
- Fase: 1 - Design system e i18n
- Origem: seções 3.1 a 3.3 e 13/fase 1.
- Dependências: PDZ-004, PDZ-006.
- Entregáveis: @nuxtjs/i18n com prefixos br/us/pt/es, cookie perdiz_locale, detecção SSR na raiz, fallback br e seletor global.
- Aceite: preferência explícita prevalece sobre Accept-Language; rota prefixada não redireciona repetidamente; troca preserva caminho/query válidos; locale não define elegibilidade.
- Testes: E2E/SSR dos quatro prefixos, fallback, cookie, Accept-Language, ausência de loop e preservação de contexto.
- Evidências: a preencher na execução.

### PDZ-008 - Traduzir a interface e padronizar formatação

- Status: pendente
- Fase: 1 - Design system e i18n
- Origem: seções 3.1, 3.4, 10 e 12.
- Dependências: PDZ-007.
- Entregáveis: catálogos br/us/pt/es, chaves semânticas, pluralização/interpolação, formatadores Intl e validação automática de traduções.
- Aceite: JSON válido e chaves equivalentes; sem concatenação gramatical indevida; moeda de exibição não converte saldo; novas telas ampliam os quatro catálogos.
- Testes: chaves ausentes, JSON inválido, datas/números/moedas nos quatro locales e conteúdo não traduzível preservado.
- Evidências: a preencher na execução.

## Fase 2 - Autenticação e autorização

Saída: acesso restrito aos dados autorizados, sem privilégios atribuídos pelo cliente.

### PDZ-009 - Implementar identidade e sessões

- Status: pendente
- Fase: 2 - Autenticação e autorização
- Origem: seções 5.5, 7 e 8.1.
- Dependências: PDZ-003, PDZ-004, PDZ-008.
- Entregáveis: Supabase Auth, cadastro, verificação de e-mail, login, logout, recuperação de senha e GET /api/me.
- Aceite: sessão verificada no servidor; senhas não são armazenadas em tabelas próprias; rotas de retorno respeitam locale e não permitem redirecionamento externo arbitrário.
- Testes: jornadas de autenticação, sessão expirada/inválida, logout e recuperação com mensagens sanitizadas.
- Evidências: a preencher na execução.

### PDZ-010 - Criar perfil, preferências e avatar

- Status: pendente
- Fase: 2 - Autenticação e autorização
- Origem: seções 3.2, 5.5, 6.1/profiles, 6.1/user_preferences e 8.3.
- Dependências: PDZ-007, PDZ-009.
- Entregáveis: migrações de profiles/user_preferences, edição autorizada e upload de avatar com políticas Storage.
- Aceite: usuário altera somente campos próprios permitidos; idioma, região, timezone e moeda são distintos; precedência perfil/cookie após login documentada e testada.
- Testes: leitura/alteração cruzada negada, sincronização de preferência e rejeição de upload inválido ou acima do limite.
- Evidências: a preencher na execução.

### PDZ-011 - Implementar papéis e autorização server-side

- Status: pendente
- Fase: 2 - Autenticação e autorização
- Origem: seções 5.9, 6.1/user_roles, 8.1 e 8.2.
- Dependências: PDZ-009.
- Entregáveis: user_roles protegido, matriz user/content_editor/moderator/market_resolver/admin, guards de UI e verificadores por endpoint.
- Aceite: atribuição privilegiada auditada; metadados editáveis não concedem papel; suspensão impede operações privadas conforme política documentada.
- Testes: matriz de permissões, tentativa de autopromoção, chamada direta a endpoint administrativo e sessão de conta suspensa.
- Evidências: a preencher na execução.

### PDZ-012 - Criar trilha de auditoria e base de privacidade/RLS

- Status: pendente
- Fase: 2 - Autenticação e autorização
- Origem: seções 5.9, 6.1/audit_logs, 8, 11 e 16.10.
- Dependências: PDZ-010, PDZ-011; ADR-010 aceito.
- Entregáveis: audit_logs, helpers de auditoria, matriz RLS deny-by-default, retenção/exclusão de dados e política de logs sem segredos.
- Aceite: ações privilegiadas registram ator, motivo e request_id; auditoria restrita; retenção concilia privacidade com histórico contábil sem apagar lançamentos contabilizados.
- Testes: acesso anônimo/cruzado negado, auditoria de ação crítica e sanitização de tokens/cookies/dados sensíveis.
- Evidências: a preencher na execução.

## Fase 3 - Mercados e conteúdo

Saída: mercados criados, revisados, publicados e exibidos por locale.

### PDZ-013 - Modelar catálogo, resultados e conteúdo localizado

- Status: pendente
- Fase: 3 - Mercados e conteúdo
- Origem: seções 3.4, 5.1 a 5.3, 5.9 e 6.
- Dependências: PDZ-012.
- Entregáveis: migrações/índices/RLS de categorias, traduções, mercados e resultados; modelagem de tags, imagens, publicação por locale e suspensão de conta exigidas mas não detalhadas no schema inicial.
- Aceite: FKs garantem resultado pertencente ao mercado; UTC e constraints válidas; binários ativos, multirresultado desabilitado; fallback de tradução explicitamente indicado.
- Testes: reset/migrações limpas, integridade referencial, unicidade, conteúdo não publicado privado e leituras públicas sem dados pessoais.
- Evidências: a preencher na execução.

### PDZ-014 - Expor catálogo, busca e filtros públicos

- Status: pendente
- Fase: 3 - Mercados e conteúdo
- Origem: seções 5.1 e 7/público.
- Dependências: PDZ-013.
- Entregáveis: GET /api/categories, /api/markets e /api/markets/:slug com paginação limitada, busca por conteúdo/categoria/tags, filtros e ordenações.
- Aceite: somente conteúdo publicado é público; filtros por status/categoria/encerramento/volume; ordenação por atividade/probabilidade/volume/encerramento e listas de destaque/recentes/populares.
- Testes: paginação/limites, filtros combinados, busca localizada, ausência de vazamento de rascunhos e payloads inválidos.
- Evidências: a preencher na execução.

### PDZ-015 - Construir exploração e página do mercado

- Status: pendente
- Fase: 3 - Mercados e conteúdo
- Origem: seções 5.1, 5.2 e 10.
- Dependências: PDZ-008, PDZ-014.
- Entregáveis: home/categorias/detalhe, resultados, regras, fontes, encerramento e espaços integrados para livro, gráfico e negociação.
- Aceite: quatro locales e layouts responsivos; probabilidade não é certeza; volume/liquidez são simulados; dados ainda não existentes exibem vazio, sem negociações inventadas.
- Testes: exploração/detalhe E2E, fallback de conteúdo, teclado e estados de erro/vazio/carregamento.
- Evidências: a preencher na execução.

### PDZ-016 - Implementar revisão e ciclo de vida dos mercados

- Status: pendente
- Fase: 3 - Mercados e conteúdo
- Origem: seções 5.3, 5.9, 7/administração e 6.2.
- Dependências: PDZ-011, PDZ-012, PDZ-013.
- Entregáveis: CRUD administrativo de categorias/tags/mercados/traduções; criação, edição, revisão, publicação, pausa e encerramento com máquina de estados server-side.
- Aceite: transições permitidas documentadas; regras/fontes obrigatórias para publicar; ações críticas pedem confirmação/motivo e auditam; resolved/cancelled só pelos fluxos de liquidação.
- Testes: permissões por papel, transições inválidas, edição concorrente/versionamento e visibilidade por locale.
- Evidências: a preencher na execução.

### PDZ-017 - Implementar favoritos privados

- Status: pendente
- Fase: 3 - Mercados e conteúdo
- Origem: seções 6.1/favorites e 7/autenticado.
- Dependências: PDZ-009, PDZ-014, PDZ-015.
- Entregáveis: favorites com RLS, POST /api/me/favorites, DELETE /api/me/favorites/:marketId e interação na UI.
- Aceite: unicidade por usuário/mercado; usuário não consulta/altera favoritos alheios; nenhuma informação privada entra no catálogo público.
- Testes: adicionar repetidamente, remover, acesso anônimo/cruzado e estado da UI após recarregar.
- Evidências: a preencher na execução.

## Fase 4 - Carteira fictícia e livro-razão

Saída: toda alteração de saldo rastreável e transações balanceadas.

### PDZ-018 - Implementar livro-razão de partidas dobradas

- Status: pendente
- Fase: 4 - Carteira fictícia e livro-razão
- Origem: seções 2, 6.1/ledger, 6.2 e 16.2/16.12.
- Dependências: PDZ-004, PDZ-012; ADR-002 e ADR-012 aceitos.
- Entregáveis: ledger_accounts/transactions/entries, funções transacionais, tipos decimais e chaves idempotentes.
- Aceite: soma zero por transação/unidade; contas de usuários/contrapartida bem definidas; lançamentos contabilizados imutáveis; correções somente compensatórias auditadas.
- Testes: desequilíbrio rejeitado no banco, duplicação de comando, rollback completo, precisão decimal e proibição de editar/apagar lançamentos.
- Evidências: a preencher na execução.

### PDZ-019 - Provisionar saldo fictício e reinicialização controlada

- Status: pendente
- Fase: 4 - Carteira fictícia e livro-razão
- Origem: seções 5.6, 5.9, 8.4 e 16.9.
- Dependências: PDZ-011, PDZ-018; ADR-009 aceito.
- Entregáveis: crédito inicial configurável e fluxo autorizado de reset, com limites, ledger e auditoria.
- Aceite: crédito inicial não duplica; reset respeita política de ordens/posições existentes; transferências entre usuários e resgate/conversão são impossíveis.
- Testes: provisionamento concorrente/repetido, reset sem permissão/acima do limite e preservação do histórico.
- Evidências: a preencher na execução.

### PDZ-020 - Expor carteira e extrato privados

- Status: pendente
- Fase: 4 - Carteira fictícia e livro-razão
- Origem: seções 5.6, 7/autenticado, 8.2 e 10.
- Dependências: PDZ-008, PDZ-019.
- Entregáveis: consultas de saldo, GET /api/me/ledger, extrato paginado e página da carteira.
- Aceite: disponível/reservado/valor de posições separados; saldo não resgatável; aviso persistente; sem botões operacionais de pagamento e sem conversão por locale.
- Testes: isolamento entre usuários, consistência com ledger, paginação e apresentação localizada em mobile/desktop.
- Evidências: a preencher na execução.

### PDZ-021 - Criar reconciliação de saldos e projeções

- Status: pendente
- Fase: 4 - Carteira fictícia e livro-razão
- Origem: seções 6.2, 11, 12/integração e 13/fase 4.
- Dependências: PDZ-018, PDZ-020.
- Entregáveis: rotina periódica e relatório auditável de reconciliação do ledger, com extensão prevista para ordens/trades/posições em PDZ-027.
- Aceite: detecta divergências sem reescrever histórico; execução repetida segura; falhas emitem alerta e diagnóstico sem dados sensíveis.
- Testes: divergência introduzida em fixture, execução concorrente/repetida e ausência de falso positivo para transações válidas.
- Evidências: a preencher na execução.

## Fase 5 - Livro de ordens e posições

Saída: concorrência não gera saldo negativo nem execução duplicada.

### PDZ-022 - Aceitar ordens limitadas e reservar recursos

- Status: pendente
- Fase: 5 - Livro de ordens e posições
- Origem: seções 5.4, 6.1/orders, 6.2, 7/contrato de ordem e 16.1 a 16.5.
- Dependências: PDZ-013, PDZ-016, PDZ-019; ADR-001, ADR-002, ADR-003 e ADR-005 aceitos.
- Entregáveis: orders, POST /api/markets/:id/orders, validação de domínio e reserva atômica de saldo de compra/quantidade de venda.
- Aceite: valida sessão, suspensão, período/status, resultado, lado, tick, quantidade e limites; não vende posição inexistente; replay não duplica e conflito de payload/chave tem erro previsível.
- Testes: saldo/posição insuficiente, tick/escala inválidos, resultado de outro mercado, ordens fora de período e reservas concorrentes.
- Evidências: a preencher na execução.

### PDZ-023 - Executar matching transacional preço-tempo

- Status: pendente
- Fase: 5 - Livro de ordens e posições
- Origem: seções 5.4, 6.1/trades, 6.2, 7 e 12.
- Dependências: PDZ-022; ADR-004 aceito.
- Entregáveis: matching determinístico persistido, trades e atualização atômica de ordens, reservas, ledger e posições.
- Aceite: melhor preço e depois mais antiga; execução parcial/total respeita limites; locks/constraints impedem sobre-execução; autoexecução segue ADR; cliente não decide preço/saldo final.
- Testes: prioridade preço-tempo, preço de execução, preenchimento parcial/total, self-trade, rollback, replay e duas ordens concorrentes no mesmo nível.
- Evidências: a preencher na execução.

### PDZ-024 - Cancelar ordens sem disputar recursos já executados

- Status: pendente
- Fase: 5 - Livro de ordens e posições
- Origem: seções 5.4, 6.2, 7/autenticado e 12/integração.
- Dependências: PDZ-023.
- Entregáveis: POST /api/orders/:id/cancel e liberação transacional da reserva remanescente; documentar expiração como opcional, sem habilitação implícita.
- Aceite: somente titular/fluxo privilegiado autorizado cancela; ordem preenchida não devolve saldo executado; repetição é segura e concorrência com matching é serializada.
- Testes: cancelamento parcial/repetido, cancelar ordem alheia e corrida cancelamento versus execução.
- Evidências: a preencher na execução.

### PDZ-025 - Disponibilizar posições e histórico pessoal

- Status: pendente
- Fase: 5 - Livro de ordens e posições
- Origem: seções 5.5, 5.7, 6.1/positions e 7/autenticado.
- Dependências: PDZ-020, PDZ-023, PDZ-024.
- Entregáveis: GET /api/me/portfolio, /api/me/orders e /api/me/trades; carteira de posições, ordens abertas e histórico/atividade.
- Aceite: quantidade/custo médio derivam de trades confirmados; valor estimado não é saldo disponível; RLS isola titular e consultas são paginadas.
- Testes: custo médio após compras/vendas parciais, projeções consistentes e acesso anônimo/cruzado negado.
- Evidências: a preencher na execução.

### PDZ-026 - Integrar livro, gráfico e negociação na UI

- Status: pendente
- Fase: 5 - Livro de ordens e posições
- Origem: seções 5.2, 5.4, 7/público, 7/contrato de ordem e 10.
- Dependências: PDZ-015, PDZ-024, PDZ-025.
- Entregáveis: GET /api/markets/:id/orderbook e /api/markets/:id/trades; livro agregado, gráfico de trades, formulário de ordem e cancelamento.
- Aceite: snapshots/trades públicos sem identidades privadas; preço/quantidade/custo/resultado potencial claros, taxas somente se definidas; resposta autoritativa atualiza IDs, executado/restante, saldo e operação.
- Testes: criar/executar/cancelar via E2E, falha/reenvio seguro, anonimização, precisão e estados nos quatro locales/mobile.
- Evidências: a preencher na execução.

### PDZ-027 - Validar integridade e reconciliação do motor

- Status: pendente
- Fase: 5 - Livro de ordens e posições
- Origem: seções 6.2, 11, 12 e 13/fase 5.
- Dependências: PDZ-021, PDZ-023, PDZ-024, PDZ-025, PDZ-026.
- Entregáveis: reconciliação ordens/reservas/trades/posições/ledger e suíte de concorrência, falhas e repetição de comandos.
- Aceite: nenhuma execução duplicada, saldo negativo indevido ou posição vendida em excesso; toda operação rastreável; divergências geram alerta sem autocorreção destrutiva.
- Testes: concorrência intensa local, falha intermediária, cancelamento simultâneo, replays e divergências deliberadas.
- Evidências: a preencher na execução.

## Fase 6 - Realtime

Saída: UI converge ao estado do banco após desconexão ou eventos repetidos.

### PDZ-028 - Publicar eventos autorizados após commit

- Status: pendente
- Fase: 6 - Realtime
- Origem: seções 4.2, 5.8, 8.2, 9 e 16.8.
- Dependências: PDZ-027; ADR-008 aceito.
- Entregáveis: outbox ou mecanismo equivalente conforme ADR, eventos market.updated/orderbook.updated/trade.created/order.updated/position.updated/market.status_changed e políticas Realtime.
- Aceite: evento corresponde a transação confirmada; contém event_id/market_id e sequência/versão apropriada; canais privados verificam titular; público recebe apenas dados públicos mínimos.
- Testes: rollback sem evento confirmado, replay da publicação, associação indevida a canal e ausência de e-mails/saldos/ordens privadas em broadcast.
- Evidências: a preencher na execução.

### PDZ-029 - Reconciliar interface após eventos e reconexões

- Status: pendente
- Fase: 6 - Realtime
- Origem: seções 5.8 e 9.
- Dependências: PDZ-026, PDZ-028.
- Entregáveis: assinaturas e limpeza de canais, deduplicação/ordenação, snapshot autorizado e recuperação ao reconectar.
- Aceite: eventos não confirmam operação financeira; snapshot reconcilia livro/trades/status e dados privados; logout remove assinatura/dados privados; troca de mercado não mantém canais obsoletos.
- Testes: duplicação, fora de ordem, evento perdido, desconexão durante trade, snapshot em corrida e logout/troca de usuário.
- Evidências: a preencher na execução.

### PDZ-030 - Medir e limitar a carga Realtime

- Status: pendente
- Fase: 6 - Realtime
- Origem: seções 5.8, 9, 11 e 12/segurança e carga.
- Dependências: PDZ-028, PDZ-029.
- Entregáveis: agrupamento/frequência conforme ADR-008, métricas de latência/reconexões e relatório de carga local/staging.
- Aceite: limites e metas documentados antes da medição; UI converge sob carga e degradação; sem publicação ilimitada ou vazamento de dados.
- Testes: rajadas de eventos, múltiplos assinantes, perda de conexão e recuperação; registrar resultados frente às metas.
- Evidências: a preencher na execução.

## Fase 7 - Resolução e administração

Saída: ações críticas autorizadas, auditadas e reproduzíveis.

### PDZ-031 - Propor e aprovar resultados com evidências

- Status: pendente
- Fase: 7 - Resolução e administração
- Origem: seções 5.3, 5.7, 5.9, 6.1/market_resolutions e 16.7.
- Dependências: PDZ-016, PDZ-027; ADR-007 aceito.
- Entregáveis: market_resolutions, coleta segura de fonte/evidência, proposta/aprovação e interface administrativa.
- Aceite: registra fonte, motivo, autor, aprovador e horário; separação de papéis e revisão por segundo responsável conforme ADR; resolving bloqueia negociação.
- Testes: proposta inválida, resultado de outro mercado, papel indevido, aprovação concorrente e impedimento de autoaprovação quando exigido.
- Evidências: a preencher na execução.

### PDZ-032 - Liquidar posições de forma idempotente

- Status: pendente
- Fase: 7 - Resolução e administração
- Origem: seções 5.7, 6.2, 7/administração e 14.
- Dependências: PDZ-027, PDZ-028, PDZ-031.
- Entregáveis: POST /api/admin/markets/:id/resolve, liquidação transacional/retomável e atualização de posições, ledger, auditoria e eventos.
- Aceite: usa somente resultado aprovado/regras publicadas; trata ordens e reservas pendentes; crédito nunca se duplica; resolved somente após contabilização consistente.
- Testes: repetição/concorrência da resolução, falha intermediária/retomada, arredondamento e reconciliação após liquidação.
- Evidências: a preencher na execução.

### PDZ-033 - Cancelar mercados e compensar operações conforme política

- Status: pendente
- Fase: 7 - Resolução e administração
- Origem: seções 5.3, 5.7, 5.9, 7/administração e 16.6.
- Dependências: PDZ-024, PDZ-027, PDZ-028, PDZ-031; ADR-006 aceito.
- Entregáveis: POST /api/admin/markets/:id/cancel, liberação/reversão simulada e lançamentos compensatórios auditados.
- Aceite: bloqueia novas ordens, trata todas as reservas/posições pela política aceita e não altera lançamentos existentes; cancelamento não disputa resolução finalizada.
- Testes: cancelamento repetido/concorrente, corrida com matching/resolução, falha/retomada e reconciliação do mercado cancelado.
- Evidências: a preencher na execução.

### PDZ-034 - Finalizar painel administrativo e suporte

- Status: pendente
- Fase: 7 - Resolução e administração
- Origem: seções 5.9, 7/administração, 8.1 e 13/fase 7.
- Dependências: PDZ-011, PDZ-012, PDZ-016, PDZ-019, PDZ-025, PDZ-032, PDZ-033.
- Entregáveis: GET /api/admin/dashboard e /api/admin/audit-logs, métricas fictícias, consulta de usuários/ordens/trades, suspensão, parâmetros de demonstração e erros sanitizados.
- Aceite: matriz de papéis aplicada no servidor; confirmações/motivos para ações críticas; nenhum editor direto de ledger; configurações não habilitam pagamentos nem burlam regras aprovadas.
- Testes: cada papel versus cada ação, acesso direto sem guard de UI, suspensão de usuário com ordens e trilha de suporte sem segredos.
- Evidências: a preencher na execução.

## Fase 8 - Hardening do protótipo

Saída: demonstração controlada, sem dinheiro real e sem abertura pública irrestrita.

### PDZ-035 - Revisar segurança, privacidade e isolamento

- Status: pendente
- Fase: 8 - Hardening do protótipo
- Origem: seções 8, 12/segurança e carga e 14.
- Dependências: PDZ-030, PDZ-034.
- Entregáveis: rate limits de login/busca/ordens/cancelamentos, proteção CSRF conforme sessão, CSP/cabeçalhos, auditoria de dependências e revisão manual de RLS/Storage/Realtime.
- Aceite: acesso mínimo, payloads limitados e validados; todas as tabelas expostas protegidas; nenhuma chave privilegiada no bundle; retenção/exclusão verificadas sem comprometer ledger.
- Testes: abuso de endpoints, falsificação de user_id/role/saldo, CSRF, upload indevido e matriz anônimo/titular/outro usuário/papéis administrativos.
- Evidências: a preencher na execução.

### PDZ-036 - Validar jornadas, acessibilidade, SEO e desempenho

- Status: pendente
- Fase: 8 - Hardening do protótipo
- Origem: seções 3, 10, 12/E2E, 13/fase 8 e 14.
- Dependências: PDZ-030, PDZ-034.
- Entregáveis: suíte E2E completa, revisão de acessibilidade, metadados/URLs localizados e relatório de desempenho com metas previamente documentadas.
- Aceite: jornadas principais nos quatro locales; mobile/tablet/desktop; teclado, foco, contraste e erros compreensíveis; sem promessas de retorno ou probabilidade tratada como certeza.
- Testes: redirecionamento/troca de idioma, autenticação, exploração, criar/executar/cancelar ordem, carteira/histórico, fluxo administrativo completo e acesso negado a /admin.
- Evidências: a preencher na execução.

### PDZ-037 - Preparar operação, alertas e recuperação

- Status: pendente
- Fase: 8 - Hardening do protótipo
- Origem: seções 8.3, 11, 13/fase 8 e 16.11.
- Dependências: PDZ-005, PDZ-027, PDZ-030, PDZ-034; ADR-011 aceito.
- Entregáveis: logs estruturados, métricas de latência/falhas/rejeições/liquidação, alertas, reconciliação agendada, runbooks de incidentes/rollback e backup/restauração.
- Aceite: ambientes separados; migrações controladas sem edição manual de schema em produção; restauração ensaiada em ambiente isolado e reconciliada; alertas acionáveis sem segredos.
- Testes: falha de matching/liquidação, divergência de ledger, restauração de backup, smoke pós-restore e procedimento de rollback não destrutivo.
- Evidências: a preencher na execução.

### PDZ-038 - Verificar limites legais e técnicos de simulação

- Status: pendente
- Fase: 8 - Hardening do protótipo
- Origem: seções 1.2, 2.1, 5.6, 8.4, 14 e 15.
- Dependências: PDZ-034, PDZ-035, PDZ-036.
- Entregáveis: revisão de avisos/termos de demonstração e inventário de rotas, dependências, flags e configurações relacionadas a pagamentos.
- Aceite: ausência de endpoints operacionais de Pix/depósito/saque/transferência; saldo fictício sem resgate/conversão; nenhuma chave/flag ativa operação real; bloqueios comerciais documentados, não implementados como atalho.
- Testes: inspeção de código/configuração/bundle e navegação da carteira/negociação em todos os locales; tentativas de ativação por configuração permanecem impossíveis.
- Evidências: a preencher na execução.

### PDZ-039 - Consolidar aceite para demonstração controlada

- Status: pendente
- Fase: 8 - Hardening do protótipo
- Origem: seções 12, 13/fase 8, 14 e 17.
- Dependências: PDZ-002, PDZ-017, PDZ-035, PDZ-036, PDZ-037 e PDZ-038; todas as fases anteriores concluídas.
- Entregáveis: relatório final de aceite com evidências por requisito, limitações conhecidas, documentação de execução e autorização da demonstração.
- Aceite: todos os critérios da seção 14 cobertos; todas as fases com saída comprovada; CI verde; nenhum risco crítico aberto de integridade/segurança; não implica autorização comercial.
- Testes: regressão integral em ambiente limpo e smoke em staging; conferir relatórios de concorrência, carga, RLS, acessibilidade e restauração.
- Evidências: a preencher na execução.

## Matriz de rastreabilidade dos critérios gerais

Os números abaixo seguem a ordem dos 13 itens da seção 14 da especificação.
Esta matriz aponta onde comprovar o aceite; não representa testes já executados.

| Item | Critério | Tarefas responsáveis |
| --- | --- | --- |
| 1 | Páginas principais nos quatro prefixos | PDZ-007, PDZ-008, PDZ-036 |
| 2 | Detecção sem loops e preferência manual | PDZ-007, PDZ-010, PDZ-036 |
| 3 | Nenhuma chave privilegiada no cliente | PDZ-003, PDZ-035 |
| 4 | RLS protege dados privados | PDZ-010, PDZ-011, PDZ-012, PDZ-013, PDZ-017, PDZ-020, PDZ-025, PDZ-035 |
| 5 | Ações críticas validadas no servidor | PDZ-011, PDZ-016, PDZ-022, PDZ-024, PDZ-031, PDZ-034 |
| 6 | Matching transacional/idempotente e concorrência | PDZ-022, PDZ-023, PDZ-024, PDZ-027 |
| 7 | Ledger balanceado e auditável | PDZ-018, PDZ-019, PDZ-021, PDZ-027 |
| 8 | Resolução sem aplicação duplicada | PDZ-031, PDZ-032, PDZ-033 |
| 9 | Permissões administrativas no servidor | PDZ-011, PDZ-016, PDZ-034, PDZ-035 |
| 10 | Realtime sem vazamento privado | PDZ-028, PDZ-029, PDZ-030, PDZ-035 |
| 11 | Dinheiro fictício identificado | PDZ-006, PDZ-015, PDZ-020, PDZ-026, PDZ-038 |
| 12 | Nenhum endpoint operacional de pagamento real | PDZ-003, PDZ-038 |
| 13 | CI executa lint/testes/build | PDZ-005, PDZ-039 |

## Cobertura complementar

| Origem | Cobertura |
| --- | --- |
| Seções 1 e 2 - Escopo e princípios | Invariantes do SDD; PDZ-003, PDZ-018, PDZ-027, PDZ-038 |
| Seção 3 - Locales e traduções | PDZ-007, PDZ-008, PDZ-010, PDZ-013, PDZ-036 |
| Seção 4 - Stack e arquitetura | PDZ-001, PDZ-003, PDZ-004, PDZ-005 |
| Seções 5.1 a 5.3 - Exploração e mercados | PDZ-013, PDZ-014, PDZ-015, PDZ-016 |
| Seção 5.4 - Livro de ordens | PDZ-022 a PDZ-027 |
| Seções 5.5 e 5.6 - Conta e carteira | PDZ-009 a PDZ-012; PDZ-018 a PDZ-021; PDZ-025 |
| Seção 5.7 - Posições e liquidação | PDZ-025, PDZ-031, PDZ-032, PDZ-033 |
| Seção 5.8 e seção 9 - Realtime | PDZ-028, PDZ-029, PDZ-030 |
| Seção 5.9 - Administração | PDZ-011, PDZ-012, PDZ-016, PDZ-019, PDZ-031 a PDZ-034 |
| Seção 6 - Dados e integridade | Migrações por módulo; PDZ-010 a PDZ-013, PDZ-017, PDZ-018, PDZ-022, PDZ-023, PDZ-025, PDZ-027, PDZ-031 |
| Seção 7 - APIs públicas | PDZ-014, PDZ-026 |
| Seção 7 - APIs autenticadas | PDZ-009, PDZ-017, PDZ-020, PDZ-022, PDZ-024, PDZ-025 |
| Seção 7 - APIs administrativas | PDZ-016, PDZ-032, PDZ-033, PDZ-034 |
| Seção 8 - Segurança e privacidade | Autorização/RLS por módulo; PDZ-003, PDZ-011, PDZ-012, PDZ-035, PDZ-038 |
| Seção 10 - UX e identidade | PDZ-006, PDZ-008, PDZ-015, PDZ-020, PDZ-026, PDZ-036 |
| Seção 11 - Operação | PDZ-004, PDZ-005, PDZ-021, PDZ-027, PDZ-030, PDZ-037 |
| Seção 12 - Testes | Testes por tarefa; PDZ-004, PDZ-005, PDZ-027, PDZ-030, PDZ-035, PDZ-036, PDZ-037, PDZ-039 |
| Seção 13 - Etapas | Fases 0 a 8 deste backlog |
| Seção 14 - Aceite | Matriz de critérios gerais; PDZ-039 |
| Seção 15 - Futuro comercial | Fora do escopo; bloqueios preservados em PDZ-038 |
| Seção 16 - Decisões | PDZ-002 e tabela de ADRs obrigatórios |
| Seção 17 - Resumo executivo | PDZ-039; integridade validada em PDZ-027 |

## Ordem inicial recomendada

Começar por PDZ-001 e pelo levantamento de PDZ-002. Em seguida, executar
PDZ-003 e PDZ-004; avançar em design/i18n em paralelo ao aceite dos ADRs
independentes. PDZ-005 exige ADR-011 aceito. Não iniciar ledger, matching,
Realtime ou liquidação sem os respectivos ADRs aceitos.

Este backlog acompanha a implementação, não aceita decisões pelo responsável
e não autoriza uso de dinheiro real. O incremento atual de código é PDZ-001.
