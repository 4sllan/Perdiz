# ADR-012 — Deploy, ambientes, backup e rollback

**Status:** Aceito — aprovado pelo responsável em 25/10/2026
**Data:** 2026-10-25
**Decisão da spec:** D-12 — `docs/specs/perdiz-platform-foundation.md` §13.5, §18

## Contexto

O protótipo precisa de ambientes reproduzíveis e procedimento mínimo
de operação, sem inflar infraestrutura nesta fase.

## Proposta

- **Ambientes:** `local` (Nuxt dev + Supabase CLI local, seeds
  fictícios), `staging` (demonstração controlada) e `production`
  (protótipo publicado) — todos exclusivamente demonstração, unidades
  `PDZ-*` separadas (ADR-002).
- **Deploy:** Nitro com preset `vercel` para staging/prod do
  protótipo (SSR serverless, preview por PR); alternativa documentada:
  `node-server` em VM única caso haja restrição de plataforma. Decisão
  final do host pode ser revisitada na Fase 8 sem impacto de
  arquitetura (Nitro abstrai).
- **Segredos:** variáveis de ambiente por ambiente; `service_role`
  somente server-side; nada em `NUXT_PUBLIC_*`.
- **Migrações:** forward-only via Supabase CLI; aplicadas por
  pipeline/manual controlado — nunca edição manual em produção.
- **Backup:** backups agendados do Supabase (plano do projeto) +
  dump semanal em staging com **teste de restore** documentado a cada
  release de fase.
- **Rollback:** `git revert` + redeploy da tag anterior; rollback de
  dados só via restore de backup — migrations não são revertidas
  automaticamente.
- **CI:** lint, format:check, typecheck, unit, integration (Supabase
  local em job) e build; E2E em job separado ou noturno (Chromium
  cacheado).

## Consequências

- Procedimentos mínimos cobrem o ciclo do protótipo sem prometer SLA.
- Qualquer mudança futura para operação comercial exigirá nova revisão
  de infraestrutura — fora do escopo (spec §16).
