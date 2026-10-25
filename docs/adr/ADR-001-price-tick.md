# ADR-001 — Faixa de preço e tick size

**Status:** Aceito — aprovado pelo responsável em 25/10/2026
**Data:** 2026-10-25
**Decisão da spec:** D-01 — `docs/specs/perdiz-platform-foundation.md` §9.2, §19

## Contexto

Ordens limitadas precisam de faixa de preço e incremento mínimo (tick)
definidos antes do modelo de dados e do motor de matching. A spec
normaliza mercados binários em `[0,1]` (preço = probabilidade
implícita), mas exige que faixa e tick sejam configuráveis por tipo de
mercado para não travar futuros formatos.

## Opções

1. **Tick fixo global 0,01**, faixa `[0,01; 0,99]`, hardcoded no schema.
2. **Faixa/tick configuráveis por mercado**, com defaults 0,01 e
   `[0,01; 0,99]`, validados por função de domínio.
3. Tick adaptativo por preço (mais fino perto dos extremos) — usado em
   algumas exchanges, complexo demais para o protótipo.

## Proposta

Adotar a opção 2:

- Colunas em `markets`: `tick_size numeric(10,6) not null default
  0.01`, `min_price numeric(10,6) not null default 0.01`,
  `max_price numeric(10,6) not null default 0.99`.
- Armazenamento de preço em `numeric(10,6)`; a validação de múltiplo
  do tick ocorre na função de aceitação de ordem
  (`price % tick_size = 0` dentro de tolerância de ponto fixo), não por
  constraint rígida — assim um mesmo schema suporta ticks distintos.
- Defaults v1: tick `0,01` (99 níveis), preço mínimo `0,01`, máximo
  `0,99`. Extremos absolutos `0` e `1` ficam fora do book — resultado
  certo não é negociável.
- Rejeição `PRICE_OUT_OF_TICK` / `PRICE_OUT_OF_RANGE` no servidor.

## Consequências

- O book binário tem no máximo 99 níveis por lado — simples de
  agregar e renderizar.
- Mudança de tick em mercado existente exige migração de política
  (ordens abertas em tick antigo); v1 proíbe alteração de tick após
  `open`.
- Futuros mercados multirresultado reutilizam o mesmo mecanismo.
