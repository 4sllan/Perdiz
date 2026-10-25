# ADR-008 — Estratégia de gráficos de preço/probabilidade

**Status:** Aceito — aprovado pelo responsável em 25/10/2026
**Data:** 2026-10-25
**Decisão da spec:** D-08 — `docs/specs/perdiz-platform-foundation.md` §4.2, §5.4

## Contexto

O detalhe do mercado precisa de histórico de preço/probabilidade e os
cards de sparkline. As opções diferem fortemente em custo de bundle.

## Opções

1. **`Chart` do PrimeVue** — wrapper sobre Chart.js (~200 kB+); rico,
   porém pesado para séries simples.
2. **Componente próprio `PriceChart` em SVG** — linha/área com
   tooltip por pointer, escalas `d3`-like implementadas à mão (~poucos
   kB), visual totalmente Perdiz.
3. Biblioteca leve externa (uPlot etc.) — nova dependência para ganho
   marginal nesta fase.

## Proposta

Adotar a opção 2:

- `PriceChart` próprio: SVG responsivo, série temporal de
  preço×tempo derivada de `trades`, grid mínimo, tooltip com valor e
  horário localizado, fallback acessível (tabela/`aria-description`
  com pontos agregados).
- Sparkline nos `MarketCard`: versão reduzida sem eixos.
- Requisitos: `prefers-reduced-motion`, altura fixa com aspect-ratio,
  degradê de fill usando tokens da marca.
- Gatilho para reabrir: necessidade de candles, zoom, crosshair
  multi-série ou exportação — então avaliar Chart.js/uPlot com ADR.

## Consequências

- Zero dependência de charting; bundle enxuto; estética alinhada à
  marca sem lutar contra theming de terceiros.
- Custo: implementação e testes do componente próprio (Fase 3/5);
  acessibilidade de dados gráficos exige atenção dedicada.
