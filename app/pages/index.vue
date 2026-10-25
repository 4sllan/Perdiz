<script setup lang="ts">
import { SIMULATION_NOTICE } from '#shared/constants/simulation'
</script>

<template>
  <div class="foundation-background flex min-h-svh flex-col px-[clamp(1.5rem,6vw,7rem)]">
    <a
      class="bg-paper absolute top-4 left-4 z-10 -translate-y-[200%] p-3 focus:translate-y-0"
      href="#conteudo"
      >Ir para o conteúdo</a
    >
    <header
      class="border-line flex min-h-22 items-center justify-between gap-4 border-b sm:min-h-28"
    >
      <NuxtLink
        class="font-display text-[2.8rem] font-bold tracking-[-0.07em] no-underline"
        to="/"
        aria-label="Perdiz, início"
      >
        perdiz<span class="text-accent" aria-hidden="true">.</span>
      </NuxtLink>
      <span class="text-muted text-[0.6rem] font-bold tracking-[0.14em] sm:text-[0.7rem]"
        >PROTÓTIPO / 001</span
      >
    </header>

    <main
      id="conteudo"
      class="animate-arrive flex-1 py-[clamp(4rem,10vh,8rem)] motion-reduce:animate-none"
    >
      <p class="text-accent mb-8 text-[0.7rem] font-bold tracking-[0.14em]">
        OBSERVAR. QUESTIONAR. EXPLORAR.
      </p>
      <h1
        class="font-display max-w-[17ch] text-[clamp(2.8rem,6.7vw,7rem)] leading-[1.02] font-normal tracking-[-0.045em]"
      >
        <span class="block">O futuro começa</span>
        <span class="block">com uma pergunta.</span>
      </h1>
      <p class="text-muted mt-8 mb-10 max-w-[48ch] text-[1.05rem] leading-[1.8]">
        Estamos construindo um espaço independente para explorar mercados de previsão. Com
        transparência nas regras e operações inteiramente fictícias.
      </p>
      <div class="flex items-center gap-2.5 text-[0.85rem] font-semibold">
        <span class="bg-accent size-2 shrink-0 rounded-full" aria-hidden="true" />
        Fundação em desenvolvimento
      </div>
      <p class="text-muted mt-3 text-[0.8rem] leading-relaxed">
        Mercados, contas e negociação ainda não estão disponíveis.
      </p>
    </main>

    <footer
      class="border-line flex flex-wrap items-center gap-x-6 gap-y-3 border-t py-6 text-[0.8rem] leading-relaxed"
    >
      <span
        class="border-accent text-accent border px-2.5 py-1.5 text-[0.7rem] font-bold tracking-[0.14em]"
        >SIMULAÇÃO</span
      >
      <p>{{ SIMULATION_NOTICE }}</p>
      <p class="text-muted w-full sm:ml-auto sm:w-auto">
        Sem depósitos, saques ou saldo resgatável.
      </p>
    </footer>
  </div>
</template>
