# ADR-003 — Saldo inicial e política de reset de demonstração

**Status:** Aceito — aprovado pelo responsável em 25/10/2026
**Data:** 2026-10-25
**Decisão da spec:** D-03 — `docs/specs/perdiz-platform-foundation.md` §8.5, §19

## Contexto

Usuários novos precisam de saldo fictício inicial e um mecanismo
controlado de recomeço quando ficam sem créditos — sem comprometer a
integridade do ledger nem virar vetor de abuso.

## Opções

1. Reset destrutivo: zerar lançamentos e recriar saldo — viola a
   imutabilidade do ledger.
2. Reset por época: fechar o estado atual, registrar ajuste
   compensatório e conceder novo saldo em transação auditada.
3. Recarga ilimitada a qualquer momento — trivializa a simulação.

## Proposta

Adotar a opção 2 (época de carteira):

- **Saldo inicial:** `10 000` PDZ, concedido no signup por transação
  `demo_grant` da conta de sistema `demo_issuance` → conta do usuário.
  Valor configurável em `demo_settings.initial_balance` (admin).
- **Reset (`POST /api/me/wallet/demo-reset`, Idempotency-Key):**
  executado em uma única transação que:
  1. Cancela todas as ordens abertas do usuário, liberando reservas;
  2. Registra posições e saldo atuais em snapshot de auditoria
     (`metadata` da transação `demo_reset`, epoch incrementado em
     `ledger_accounts.epoch` ou tabela `wallet_epochs`);
  3. Baixa posições remanescentes com lançamentos `demo_reset_clear`
     (contra conta de sistema);
  4. Concede novo `demo_grant` do saldo inicial vigente.
- **Limites:** cooldown padrão de 24h por usuário
  (`demo_settings.reset_cooldown`), contador de resets auditado;
  admin pode forçar ou bloquear por usuário.
- Histórico preservado: extrato mostra épocas; posições encerradas por
  reset ficam marcadas, nunca apagadas.

## Consequências

- Ledger permanece append-only e reconciliável; resets são eventos
  normais de domínio, não manutenção manual.
- Cooldown + auditoria coíbem farming de saldo sem eliminar a
  possibilidade de recomeçar a simulação.
- A tabela/coluna de epoch precisa entrar na migration da Fase 4.
