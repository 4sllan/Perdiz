# ADR-002 — Unidade de demonstração, precisão e arredondamento

**Status:** Aceito — aprovado pelo responsável em 25/10/2026
**Data:** 2026-10-25
**Decisão da spec:** D-02 — `docs/specs/perdiz-platform-foundation.md` §10.3, §19

## Contexto

O livro-razão precisa de uma unidade monetária fictícia bem definida,
com precisão e regras de arredondamento únicas, separada por ambiente e
jamais conversível em moeda real. A spec exige que BRL/USD/EUR sejam
apenas formatação de exibição.

## Opções

1. Saldo denominado em BRL "simulado".
2. Unidade própria neutra (`PDZ`), com `unit_code` explícito no ledger.
3. Unidade própria + câmbio simulado por locale — rejeitado, sugere
   conversibilidade.

## Proposta

Adotar a opção 2:

- `unit_code = 'PDZ'` ("créditos Perdiz"), registrado em
  `ledger_accounts.unit_code` e em toda `ledger_transaction`.
- Separação por ambiente via `unit_code` derivado da config do
  servidor: `PDZ-DEV` (local), `PDZ-STG` (staging), `PDZ` (produção do
  protótipo). Sem conversão entre unidades — a constraint de soma zero
  é por transação **e por unit_code**.
- Rótulo de UI sempre "créditos de demonstração"; símbolo/formato por
  locale via `Intl.NumberFormat` com `currencyDisplay` custom —
  **nunca** símbolo `R$`/`$`/`€` junto ao saldo.
- Precisão: `ledger_entries.amount numeric(24,8)`;
  `positions.quantity` e `orders.quantity numeric(20,8)`;
  preços `numeric(10,6)` (ver ADR-001).
- Arredondamento: custo de trade `price × qty` arredondado
  `HALF_UP` para 8 casas no momento da escrita do lançamento;
  projeções nunca arredondam para exibição antes do cálculo final.
- Quantidade mínima de ordem: `1` unidade de share (configurável em
  `demo_settings`); shares fracionadas são permitidas pela precisão,
  mas a UI v1 trabalha com quantidades inteiras.

## Consequências

- Invariante auditável: toda transação soma zero dentro do mesmo
  `unit_code`.
- `unit_code` por ambiente impede contaminação acidental de dados
  entre bancos e deixa explícito que não há lastro real.
- A escolha de `HALF_UP` em 8 casas torna diferenças de arredondamento
  desprezíveis para a escala do protótipo e determinísticas nos testes.
