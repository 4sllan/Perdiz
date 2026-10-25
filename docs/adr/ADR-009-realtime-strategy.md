# ADR-009 — Estratégia Realtime: canais, frequência e agregação

**Status:** Aceito — aprovado pelo responsável em 25/10/2026
**Data:** 2026-10-25
**Decisão da spec:** D-09 — `docs/specs/perdiz-platform-foundation.md` §13.4

## Contexto

Book, trades, status de mercado e dados privados (ordens, posições,
carteira) precisam de atualização em tempo real sem vazar dados nem
transformar eventos em fonte de verdade.

## Opções

1. `postgres_changes` direto nas tabelas — acopla cliente ao schema,
   vaza linhas inteiras e gera tráfego por linha alterada.
2. **Broadcast server-side** após commit, em canais nomeados —
   payloads mínimos e autorizados.
3. Polling — simples, mas não é realtime e escala mal.

## Proposta

Adotar a opção 2:

- **Canais:** `market:{market_id}` (público: `orderbook.updated`,
  `trade.created`, `market.updated`, `market.status_changed`);
  `user:{user_id}` (privado: `order.updated`, `position.updated`,
  `wallet.updated`). Autorização do canal privado conforme mecanismo
  de autorização Realtime da versão instalada (validar em docs —
  canal privado exige verificação server-side do subscribe).
- **Publicação:** serviços emitem via cliente admin **após** o commit
  da transação (outbox leve em `server/` se volume exigir). Payload:
  `{ event_id, market_id?, version, minimal data }` — book carrega
  apenas `{version}` e o cliente refaz `GET /orderbook`; `trade.created`
  carrega `{price, qty, executed_at}` (sem PII); eventos privados
  carregam `{order_id, status}` e disparam refetch autorizado.
- **Cliente:** composable `useRealtimeChannel` com subscribe,
  deduplicação por `event_id`/`version`, debounce (~250 ms) para bursts,
  e **reconciliação por snapshot** ao reconectar (refetch antes de
  reaplicar eventos).
- **Frequência:** sem limite artificial na v1 — eventos são por commit
  e o cliente agrega; se carga demonstrar necessidade, ADR futuro
  introduz coalescência server-side por mercado.

## Consequências

- Payloads mínimos ⇒ superfície de vazamento pequena e tráfego
  previsível.
- "Refetch on event" mantém o banco como fonte de verdade e simplifica
  deduplicação/fora-de-ordem.
- Autorização de canal privado é o ponto a validar primeiro na
  implementação (bloqueante para eventos `user:*`).
