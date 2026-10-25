<template>
  <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
    <span
      class="border-accent text-accent border px-2.5 py-1.5 text-[0.7rem] font-bold tracking-[0.14em]"
      >{{ $t('simulation.badge') }}</span
    >
    <p>{{ $t('simulation.notice') }}</p>
    <p class="text-muted w-full sm:ml-auto sm:w-auto">{{ $t('simulation.detail') }}</p>
  </div>
</template>
