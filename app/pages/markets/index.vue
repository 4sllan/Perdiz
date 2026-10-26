<script setup lang="ts">
const { locale, t } = useI18n()
const q = ref('')
const category = ref('')

const { data: categories } = await useFetch('/api/categories', {
  query: { locale },
})
const { data, pending, refresh } = await useFetch('/api/markets', {
  query: { locale, status: 'open', q, category, per_page: 24 },
  watch: [q, category, locale],
})

const rows = computed(() => (data.value?.data ?? []) as any[])
const catOptions = computed(() => [
  { label: t('markets.allCategories'), value: '' },
  ...(categories.value?.data ?? []).map((c: any) => ({
    label: c.category_translations[0]?.name ?? c.slug,
    value: c.slug,
  })),
])
</script>

<template>
  <div class="py-[clamp(2rem,6vh,4rem)]">
    <h1 class="font-display mb-6 text-4xl tracking-[-0.03em]">{{ t('markets.title') }}</h1>
    <div class="mb-8 flex flex-wrap gap-3">
      <InputText v-model="q" :placeholder="t('markets.search')" class="w-full sm:w-72" />
      <Select
        v-model="category"
        :options="catOptions"
        option-label="label"
        option-value="value"
        class="w-full sm:w-56"
      />
    </div>

    <div v-if="pending" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton v-for="i in 6" :key="i" height="9rem" />
    </div>
    <Message v-else-if="!rows.length" severity="info" :closable="false">{{
      t('markets.empty')
    }}</Message>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card v-for="m in rows" :key="m.id">
        <template #title>
          <NuxtLinkLocale
            :to="`/markets/${m.slug}`"
            class="font-display text-lg leading-snug no-underline"
            >{{ m.market_translations[0]?.title }}</NuxtLinkLocale
          >
        </template>
        <template #content>
          <Tag :value="t(`marketStatus.${m.status}`)" severity="info" class="mb-2" />
          <p class="text-muted text-sm">
            {{ t('markets.closesAt') }}:
            {{
              new Date(m.closes_at).toLocaleDateString(
                locale === 'us'
                  ? 'en-US'
                  : locale === 'es'
                    ? 'es-ES'
                    : locale === 'pt'
                      ? 'pt-PT'
                      : 'pt-BR',
              )
            }}
          </p>
        </template>
      </Card>
    </div>
  </div>
</template>
