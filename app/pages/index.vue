<template>
  <div class="animate-arrive py-[clamp(4rem,10vh,8rem)] motion-reduce:animate-none">
    <p class="text-accent mb-8 text-[0.7rem] font-bold tracking-[0.14em]">
      {{ $t('home.kicker') }}
    </p>
    <h1
      class="font-display max-w-[17ch] text-[clamp(2.8rem,6.7vw,7rem)] leading-[1.02] font-normal tracking-[-0.045em]"
    >
      <span class="block">{{ $t('home.titleLine1') }}</span>
      <span class="block">{{ $t('home.titleLine2') }}</span>
    </h1>
    <p class="text-muted mt-8 mb-10 max-w-[48ch] text-[1.05rem] leading-[1.8]">
      {{ $t('home.lead') }}
    </p>
    <div class="flex items-center gap-2.5 text-[0.85rem] font-semibold">
      <span class="bg-accent size-2 shrink-0 rounded-full" aria-hidden="true" />
      {{ $t('home.status') }}
    </div>
    <p class="text-muted mt-3 text-[0.8rem] leading-relaxed">
      {{ $t('home.note') }}
    </p>
  </div>
</template>
