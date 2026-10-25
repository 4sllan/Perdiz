# ADR-011 — Consolidação de `docs `/`docs` e política de ADRs

**Status:** Aceito — aprovado pelo responsável em 25/10/2026
**Data:** 2026-10-25
**Decisão da spec:** D-11 — `docs/specs/perdiz-platform-foundation.md` §2.6

## Contexto

O repositório tem `docs ` (com espaço final no nome, contendo apenas
`specs/` vazio) e agora `docs/` (criada para esta spec, `adr/` e
`tasks/`). Dois diretórios irmãos quase homônimos confundem tooling,
links e contribuidores — no Windows, inclusive, podem colidir.

## Proposta

- `docs/` (sem espaço) é o diretório canônico: `specs/`, `adr/`,
  `tasks/` e futuros documentos.
- Remover `docs /specs` (vazio) e o diretório `docs /`.
- Atualizar `.prettierignore`: remover a linha `docs /`; decidir por
  **manter `docs/` fora do Prettier** também — docs de spec/ADR não
  devem ser reformatados como efeito colateral de `pnpm format`
  (mesma motivação que já excluía `.devin/`). Adicionar `docs/`.
- Corrigir links do README para a nova árvore (spec atual + tasks +
  ADRs) na mesma alteração.
- Convenção de ADRs: `docs/adr/ADR-NNN-slug.md`, status
  `Proposta → Aceito/Rejeitado/Substituído`, aceite registrado no
  próprio arquivo; ADRs substituídos permanecem versionados.

## Consequências

- Remove armadilha de path com espaço (scripts, links Markdown,
  ferramentas).
- Execução na Fase 0 junto à normalização do git; nenhum conteúdo
  existente é perdido (a pasta antiga está vazia).
