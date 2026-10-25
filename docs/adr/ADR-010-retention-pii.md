# ADR-010 — Retenção de auditoria e dados pessoais

**Status:** Aceito — aprovado pelo responsável em 25/10/2026
**Data:** 2026-10-25
**Decisão da spec:** D-10 — `docs/specs/perdiz-platform-foundation.md` §13.5, §14

## Contexto

Trilha de auditoria e dados pessoais têm necessidades opostas:
imutabilidade/rastreabilidade vs. minimização/exclusão. É preciso
definir retenção e anonimização sem quebrar o ledger.

## Proposta

- **`audit_logs`:** append-only; retenção durante a vida do ambiente do
  protótipo; exportação antes de teardown. `metadata` nunca contém
  segredos, tokens ou PII além de identificadores necessários.
- **Dados pessoais:** coleta mínima (e-mail via Auth, `display_name`,
  avatar, preferências). Conta excluída pelo usuário:
  1. Anonimiza `profiles` (`display_name → 'usuário removido'`,
     `avatar_path → null`, `locale/region` reset);
  2. Remove o usuário no `auth.users` via admin (apaga e-mail/sessões);
  3. Preserva `ledger`, `trades`, `orders` e `audit_logs` com o
     `user_id` pseudonimizado (id permanece, sem campos de identidade).
- **Retenção padrão:** dados de conta ativa enquanto a conta existir;
  registros financeiros simulados e auditoria mantidos para
  integridade do livro-razão (justificativa documentada na política
  de privacidade do protótipo).
- `avatar` e imagens de mercado em Storage com política de remoção em
  cascata na exclusão.
- Logs de aplicação (Nitro): sem e-mail/senha/tokens; retenção
  operacional curta (30 dias) configurável.

## Consequências

- Integridade referencial preservada: FKs e reconciliação não quebram
  na exclusão de conta.
- Política simples o bastante para prototipar e honesta o bastante
  para virar base da política real futura.
