<script setup lang="ts">
definePageMeta({ middleware: 'admin' })
</script>

<template>
  <div class="py-[clamp(3rem,8vh,6rem)]">
    <h1 class="font-display mb-6 text-4xl tracking-[-0.03em]">{{ $t('admin.title') }}</h1>
    <p class="text-muted">{{ $t('states.empty') }}</p>
  </div>
</template>
