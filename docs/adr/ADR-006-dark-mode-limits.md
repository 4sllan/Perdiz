# ADR-006 — Tema escuro e limites por usuário/ordem/mercado

**Status:** Aceito — aprovado pelo responsável em 25/10/2026
**Data:** 2026-10-25
**Decisão da spec:** D-06 — `docs/specs/perdiz-platform-foundation.md` §15, §9.2

## Contexto

Dois pontos operacionais: (a) se o tema escuro entra na v1 — a paleta
atual é light-only (`color-scheme: light`); (b) limites quantitativos
que protegem o motor e a UX antes do detalhamento das migrations.

## Proposta A — Tema

- **v1 somente claro.** O preset é definido sem `colorScheme.dark` e
  `darkModeSelector` fica inerte; `color-scheme: light` já está em
  `main.css`.
- Reavaliar pós-Fase 8: habilitar dark exige revisar tokens semânticos
  de dados (buy/sell, estados) e o utility `foundation-background`.

## Proposta B — Limites (defaults em `demo_settings`, editáveis por admin)

| Limite | Default v1 |
| --- | --- |
| Ordens abertas por usuário por mercado | 50 |
| Ordens abertas totais por usuário | 200 |
| Quantidade por ordem | ≤ 1 000 000 shares, ≥ 1 |
| Notional por ordem de compra | ≤ saldo disponível |
| Criação de ordem | 30/min por usuário |
| Cancelamento | 60/min por usuário |
| Busca/listagem pública | 120/min por IP |
| Reset de carteira | 1×/24h (ADR-003) |
| Paginação pública | 50 itens/página, máx. 200 em admin |

- Violações retornam códigos estáveis (`RATE_LIMITED`,
  `ORDER_LIMIT_EXCEEDED`, `QTY_OUT_OF_RANGE`).
- Rate limiting implementado server-side (middleware Nitro + bucket
  por usuário/IP persistido ou em memória com degradê documentado —
  decisão de infra na implementação, sem impacto de contrato).

## Consequências

- Limites são dados de configuração, não constantes de código —
  ajustáveis sem deploy.
- Light-only reduz superfície de tokens e testes de contraste na v1.
