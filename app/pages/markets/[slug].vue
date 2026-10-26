<script setup lang="ts">
const { locale, t } = useI18n()
const route = useRoute()
const { data, error } = await useFetch(`/api/markets/${route.params.slug}`, {
  query: { locale },
})
const m = computed(() => data.value?.data as any)
const tr = computed(() => m.value?.market_translations?.[0] as any)
const intlLocale = computed(() =>
  locale.value === 'us'
    ? 'en-US'
    : locale.value === 'es'
      ? 'es-ES'
      : locale.value === 'pt'
        ? 'pt-PT'
        : 'pt-BR',
)
</script>

<template>
  <div class="py-[clamp(2rem,6vh,4rem)]">
    <Message v-if="error" severity="error" :closable="false">{{ t('states.error') }}</Message>
    <template v-else-if="m">
      <Tag :value="t(`marketStatus.${m.status}`)" severity="info" class="mb-4" />
      <h1 class="font-display max-w-[24ch] text-4xl leading-tight tracking-[-0.03em]">
        {{ tr?.title }}
      </h1>
      <p class="text-muted mt-4 max-w-[60ch] leading-relaxed">{{ tr?.description }}</p>

      <div class="border-line mt-8 grid gap-4 border-t pt-8 sm:grid-cols-3">
        <div>
          <p class="text-muted text-xs tracking-wider uppercase">{{ t('markets.closesAt') }}</p>
          <p class="mt-1 font-semibold">
            {{ m.closes_at ? new Date(m.closes_at).toLocaleDateString(intlLocale) : '—' }}
          </p>
        </div>
        <div>
          <p class="text-muted text-xs tracking-wider uppercase">{{ t('markets.outcomes') }}</p>
          <p class="mt-1 font-semibold">
            {{ m.market_outcomes.map((o: any) => o.outcome_key).join(' / ') }}
          </p>
        </div>
        <div>
          <p class="text-muted text-xs tracking-wider uppercase">
            {{ t('markets.resolutionSource') }}
          </p>
          <a
            v-if="tr?.resolution_source_url"
            :href="tr.resolution_source_url"
            class="text-accent mt-1 block font-semibold"
            target="_blank"
            rel="noopener"
            >{{ t('markets.viewSource') }}</a
          >
        </div>
      </div>

      <Card class="mt-8">
        <template #title>{{ t('markets.resolutionRules') }}</template>
        <template #content>
          <p class="text-muted text-sm leading-relaxed">{{ tr?.resolution_rules }}</p>
        </template>
      </Card>

      <Message severity="warn" :closable="false" class="mt-6">{{
        t('markets.orderbookSoon')
      }}</Message>
    </template>
  </div>
</template>
