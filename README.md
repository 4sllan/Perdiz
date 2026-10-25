# Perdiz

Protótipo independente de mercados de previsão com dinheiro fictício.
Sem depósitos, saques, Pix, transferências entre usuários ou saldo resgatável.

## Estado atual

Fundação Nuxt 4, Vue 3, TypeScript e Tailwind CSS 4 em desenvolvimento (PDZ-001).
A página inicial informa os limites da demonstração. Mercados, autenticação,
Supabase, internacionalização e negociação ainda não foram implementados.

## Requisitos

- Node.js 24.18.1 (ver `.nvmrc`).
- pnpm 11.18.0, fixado em `package.json`.
- Docker (para `supabase start` local) — opcional nesta etapa.

## Supabase local

A integração usa `@supabase/ssr` com fábricas próprias (ADR-007):
cliente de navegador (anon), cliente servidor por request com cookies
e cliente admin `service_role` confinado a `server/utils`.

1. Copie `.env.example` para `.env`.
2. Rode `pnpm supabase start` (requer Docker) e
   `pnpm supabase status` para obter `anon`/`service_role` locais.
3. Preencha `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_ANON_KEY`
   e `NUXT_SUPABASE_SERVICE_ROLE_KEY` no `.env` — nunca commitar.
   A chave `service_role` jamais usa prefixo `NUXT_PUBLIC_*`.

Migrações versionadas ficam em `supabase/migrations/`; seeds em
`supabase/seed.sql` contêm exclusivamente dados fictícios.

## Executar localmente

```sh
nvm use
pnpm install --frozen-lockfile
pnpm dev
```

Acesse `http://127.0.0.1:3000`. O pós-install executa `nuxt prepare`,
que gera os tipos e a configuração ESLint em `.nuxt/`.
Não versione `.nuxt/`, `.output/`, `node_modules/` ou segredos.

## Estilos

Tailwind CSS 4 integrado diretamente ao Vite com `@tailwindcss/vite`.
As classes utilitárias ficam nos componentes Vue; cores, fontes e animações
são definidas com `@theme` em `app/assets/css/main.css`.
Esta integração não usa o módulo `@nuxtjs/tailwindcss` nem exige
`tailwind.config.js`. Não há dependência de fontes remotas.

## Comandos

| Comando                 | Finalidade                                    |
| ----------------------- | --------------------------------------------- |
| `pnpm dev`              | Servidor de desenvolvimento local             |
| `pnpm lint`             | Análise estática com ESLint                   |
| `pnpm format:check`     | Conferir formatação                           |
| `pnpm format`           | Formatar os arquivos de código e configuração |
| `pnpm typecheck`        | Verificar tipos com Nuxt/vue-tsc              |
| `pnpm test`             | Testes unitários com Vitest                   |
| `pnpm test:watch`       | Vitest em modo observação                     |
| `pnpm test:e2e:install` | Instalar Chromium para o Playwright           |
| `pnpm test:e2e`         | Smoke SSR e navegação em desktop/mobile       |
| `pnpm build`            | Gerar o build de produção                     |
| `pnpm preview`          | Servir o build localmente                     |

Os documentos preexistentes em `docs ` e `.devin/` são excluídos do
formatador para não reformatar a especificação como efeito colateral.

## Testes preparados, ainda não executados

Por orientação do responsável, os testes ficam configurados, mas não devem
ser executados neste incremento. O navegador do Playwright não é baixado
na instalação normal de dependências.

Quando a execução for autorizada:

```sh
pnpm test
pnpm test:e2e:install
pnpm test:e2e
```

O E2E inicia seu próprio servidor na porta 3100, sem reutilizar outra aplicação.
Testes de componentes, banco, autorização e concorrência serão adicionados
nos incrementos correspondentes; o smoke inicial não cobre esses requisitos.
A PDZ-001 permanece em andamento até concluir as validações exigidas pelo SDD,
inclusive a instalação limpa e os testes.

## Documentação e escopo

- [Especificação da fundação](docs/specs/perdiz-platform-foundation.md)
- [Decisões de arquitetura (ADRs)](docs/adr)
- [Processo SDD](.devin/sdd.md)
- [Backlog e evidências](docs/tasks/perdiz-tasks.md)

Decisões de domínio dependem de ADRs aceitos.
Nenhuma configuração desta fundação habilita pagamentos ou operações reais.
