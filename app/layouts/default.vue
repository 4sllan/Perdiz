<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="foundation-background flex min-h-svh flex-col px-[clamp(1.5rem,6vw,7rem)]">
    <a
      class="bg-paper absolute top-4 left-4 z-10 -translate-y-[200%] p-3 focus:translate-y-0"
      href="#conteudo"
      >{{ t('nav.skipToContent') }}</a
    >
    <header
      class="border-line flex min-h-22 items-center justify-between gap-4 border-b sm:min-h-28"
    >
      <NuxtLinkLocale
        class="font-display text-[2.8rem] font-bold tracking-[-0.07em] no-underline"
        to="/"
        :aria-label="t('app.homeAria')"
      >
        perdiz<span class="text-accent" aria-hidden="true">.</span>
      </NuxtLinkLocale>
      <div class="flex items-center gap-4">
        <LayoutLocaleSwitcher />
        <span class="text-muted text-[0.6rem] font-bold tracking-[0.14em] sm:text-[0.7rem]">{{
          t('app.tag')
        }}</span>
      </div>
    </header>

    <main id="conteudo" class="flex-1">
      <slot />
    </main>

    <footer class="border-line border-t py-6 text-[0.8rem] leading-relaxed">
      <LayoutSimulationBanner />
    </footer>
  </div>
</template>
