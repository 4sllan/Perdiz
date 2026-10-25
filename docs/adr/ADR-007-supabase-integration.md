# ADR-007 — Integração Supabase no Nuxt

**Status:** Aceito — aprovado pelo responsável em 25/10/2026
**Data:** 2026-10-25
**Decisão da spec:** D-07 — `docs/specs/perdiz-platform-foundation.md` §13.1

## Contexto

São necessários três tipos de cliente Supabase: browser (anon,
respeitando RLS), servidor por-request (sessão via cookies SSR) e
servidor privilegiado (`service_role`, confinado a `server/`). A rota
de integração afeta controle de sessão, redirects e interação com o
i18n prefixado.

## Opções

1. **`@nuxtjs/supabase` 2.x** — módulo oficial da comunidade: clientes
   auto-importados, sessão SSR gerenciada, middleware de redirects.
2. **`@supabase/ssr` + `@supabase/supabase-js` manual** — fábricas
   próprias em `server/utils` + composable cliente; controle total de
   cookies, redirects e ciclo de vida.
3. `supabase-js` puro sem `@supabase/ssr` — manipulação manual de
   cookies de sessão reinventa o pacote SSR.

## Proposta

Adotar a opção 2 (`@supabase/ssr` manual):

- `server/utils/supabase.ts`: `createServerClient` por request com
  cookies do evento H3; `serverSupabaseAdmin()` isolado com
  `service_role` de `runtimeConfig` privado, importado apenas por
  serviços/repositórios.
- `app/composables/useSupabase.ts`: cliente browser com anon key de
  `runtimeConfig.public`.
- Motivos: o módulo `@nuxtjs/supabase` executa redirects de auth
  globais que colidiriam com `strategy: 'prefix'` e com a detecção
  customizada de locale; integração manual torna sessão, cookies e
  autorização explícitos e testáveis, e evita comportamento
  automático difícil de depurar.
- Se durante a implementação a v2.x do módulo provar-se configurável o
  bastante (redirects desligáveis sem hacks), reabrir este ADR com
  evidência.

## Consequências

- Mais código de setup próprio (~3 fábricas + helpers de sessão),
  compensado por previsibilidade.
- Renovação de sessão e cookies seguem `@supabase/ssr` oficial;
  testes de integração cobrem expiração e logout.
