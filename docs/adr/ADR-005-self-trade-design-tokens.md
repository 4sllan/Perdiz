# ADR-005 — Prevenção de autoexecução e mapa de tokens Perdiz→PrimeVue

**Status:** Aceito — aprovado pelo responsável em 25/10/2026
**Data:** 2026-10-25
**Decisão da spec:** D-05 — `docs/specs/perdiz-platform-foundation.md` §9.2, §5.2

## Contexto

Duas decisões agrupadas por serem independentes e de menor impacto
isolado: (a) comportamento do matching quando uma ordem encontraria a
própria contraparte; (b) mapeamento dos tokens de marca existentes para
o preset PrimeVue.

## Proposta A — Self-trade prevention

- Na varredura do book, o matching **ignora níveis pertencentes ao
  mesmo `user_id`** e continua nos níveis seguintes (política
  "skip-self"). Se só restarem ordens próprias, o remanescente
  descansa no book.
- Determinístico, sem cancelamentos surpresa nem rejeição da ordem
  inteira; coberto por teste dedicado.
- Alternativas rejeitadas: `cancel-newest` (cancela parte da ordem
  entrante — efeito colateral invisível ao usuário) e `reject` (pune
  ordens legítimas em mercado fino).

## Proposta B — Mapa de tokens

Preset `definePreset(Aura, …)` em `app/assets/theme/perdiz.preset.ts`
(arquivo final conforme suporte da versão instalada):

| Perdiz (`@theme`) | Token PrimeVue | Valor |
| --- | --- | --- |
| `--color-paper #f3f0e7` | `surface.ground` / `surface.0` | fundo da app |
| `--color-ink #26372b` | `text.color` | texto |
| `--color-muted #566050` | `text.muted.color` | texto secundário |
| `--color-accent #a33f24` | `primary.color` + escala `primary.*` | ação/marca |
| `--color-line #d1d3c5` | `content.border.color` | divisores |
| — novo | `semantic.buy` → `#2f7a57` | lado compra |
| — novo | `semantic.sell` → `primary` (accent) | lado venda |
| `--font-sans` | `font.family` | UI |
| — | `border.radius` | `0.375rem` |
| — | `focus.ring` | accent, largura 2–3px |

- Escalas `primary.50…950` derivadas do accent (geradas uma vez e
  fixadas literalmente no preset — sem cálculo em runtime).
- Utilitários semânticos do `tailwindcss-primeui` (`bg-primary`,
  `text-muted-color`) passam a refletir a marca Perdiz.
- Tema escuro: ver ADR-006 (adiado).

## Consequências

- Fonte única de verdade visual: tokens Perdiz alimentam o preset;
  Tailwind cobre layout. Documentado na spec §5–6.
- Mudanças de marca futuras alteram um arquivo de preset + `@theme`,
  sem caça a overrides.
