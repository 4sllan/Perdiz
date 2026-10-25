<script setup lang="ts">
import { SIMULATION_NOTICE } from '#shared/constants/simulation'
</script>

<template>
  <div
    class="foundation-background flex min-h-svh flex-col px-[clamp(1.5rem,6vw,7rem)]"
  >
    <a
      class="absolute top-4 left-4 z-10 -translate-y-[200%] bg-paper p-3 focus:translate-y-0"
      href="#conteudo"
      >Ir para o conteúdo</a
    >
    <header
      class="flex min-h-22 items-center justify-between gap-4 border-b border-line sm:min-h-28"
    >
      <NuxtLink
        class="font-display text-[2.8rem] font-bold tracking-[-0.07em] no-underline"
        to="/"
        aria-label="Perdiz, início"
      >
        perdiz<span class="text-accent" aria-hidden="true">.</span>
      </NuxtLink>
      <span
        class="text-[0.6rem] font-bold tracking-[0.14em] text-muted sm:text-[0.7rem]"
        >PROTÓTIPO / 001</span
      >
    </header>

    <main
      id="conteudo"
      class="flex-1 animate-arrive py-[clamp(4rem,10vh,8rem)] motion-reduce:animate-none"
    >
      <p class="mb-8 text-[0.7rem] font-bold tracking-[0.14em] text-accent">
        OBSERVAR. QUESTIONAR. EXPLORAR.
      </p>
      <h1
        class="max-w-[17ch] font-display text-[clamp(2.8rem,6.7vw,7rem)] leading-[1.02] font-normal tracking-[-0.045em]"
      >
        <span class="block">O futuro começa</span>
        <span class="block">com uma pergunta.</span>
      </h1>
      <p
        class="mt-8 mb-10 max-w-[48ch] text-[1.05rem] leading-[1.8] text-muted"
      >
        Estamos construindo um espaço independente para explorar mercados de
        previsão. Com transparência nas regras e operações inteiramente
        fictícias.
      </p>
      <div class="flex items-center gap-2.5 text-[0.85rem] font-semibold">
        <span
          class="size-2 shrink-0 rounded-full bg-accent"
          aria-hidden="true"
        />
        Fundação em desenvolvimento
      </div>
      <p class="mt-3 text-[0.8rem] leading-relaxed text-muted">
        Mercados, contas e negociação ainda não estão disponíveis.
      </p>
    </main>

    <footer
      class="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line py-6 text-[0.8rem] leading-relaxed"
    >
      <span
        class="border border-accent px-2.5 py-1.5 text-[0.7rem] font-bold tracking-[0.14em] text-accent"
        >SIMULAÇÃO</span
      >
      <p>{{ SIMULATION_NOTICE }}</p>
      <p class="w-full text-muted sm:ml-auto sm:w-auto">
        Sem depósitos, saques ou saldo resgatável.
      </p>
    </footer>
  </div>
</template>
