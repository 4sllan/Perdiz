# ADR-004 — Reservas, lastro de posições e cancelamento de mercado

**Status:** Aceito — aprovado pelo responsável em 25/10/2026
**Data:** 2026-10-25
**Decisão da spec:** D-04 — `docs/specs/perdiz-platform-foundation.md` §9.2, §19

## Contexto

A spec permite vender apenas posições existentes, mas não definia como
posições passam a existir nem o lastro das reservas. Sem essa decisão,
venda descoberta ou crédito implícito entrariam por conveniência.

## Proposta

### Origem e lastro

- Posições existem **somente** a partir de trades executados
  (compra ⇒ +posição no outcome comprado). Não há emissão de posição
  por admin nem short selling na v1.
- Apostar contra um resultado em mercado binário = **comprar o outcome
  oposto** (`NO`), não vender `YES` descoberto.

### Reservas

- **Compra:** na aceitação, reserva-se `price × qty` (custo máximo) —
  lançamento usuário `available` → usuário `reserved` (mesmo
  `unit_code`, soma zero). Execução consome a reserva pelo custo real
  (preço maker) e devolve a diferença ao disponível; cancelamento
  devolve o restante.
- **Venda:** na aceitação, trava-se `qty` da posição —
  `positions.reserved_quantity` com `CHECK (reserved_quantity BETWEEN
  0 AND quantity)`. Execução baixa posição e reserva
  proporcionalmente; cancelamento destrava o remanescente.
- Reservas vivem no ledger/sub-conta e em campo de posição —
  reconciliáveis por rotina (spec §10.2).

### Mercado cancelado (`cancelled`)

Em uma única transação de domínio:

1. Cancela todas as ordens abertas, liberando reservas;
2. Reembolsa cada posição pelo **custo médio**
   (`average_cost × quantity`) via transação `market_cancel_refund`
   emitida pela conta de sistema — o ledger de cada holder recebe de
   volta o que pagou; quem vendeu já recebeu no trade;
3. Marca outcomes sem vencedor e registra motivo + evidência na
   auditoria.

### Alternativas consideradas

- Reverter trades individualmente: rejeitada — viola imutabilidade do
  ledger e cria cascata de correções.
- Liquidar no último preço: rejeitada — preço de mercado cancelado é
  arbitrário e injusto.
- Marcar posição como "sem valor": rejeitada — pune holders sem falta
  própria e diverge do lastro pago.

## Consequências

- Conta de sistema `demo_issuance` pode ficar negativa — aceitável,
  pois emite unidade fictícia; o saldo dela é métrica de emissão, não
  passivo real.
- Reembolso a custo médio é neutro em expectativa e simples de auditar.
- Função `cancel_market` precisa dos mesmos locks do matching.
