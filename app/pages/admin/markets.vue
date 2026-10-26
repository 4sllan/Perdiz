<script setup lang="ts">
definePageMeta({ middleware: 'admin' })
const { t } = useI18n()

const { data, refresh } = await useFetch('/api/admin/markets')
const acting = ref<string | null>(null)

async function publish(id: string) {
  acting.value = id
  try {
    await $fetch(`/api/admin/markets/${id}/publish`, {
      method: 'POST',
      body: { to: 'open', reason: 'publicação via painel' },
    })
    await refresh()
  } finally {
    acting.value = null
  }
}
</script>

<template>
  <div class="py-[clamp(2rem,6vh,4rem)]">
    <h1 class="font-display mb-6 text-4xl tracking-[-0.03em]">
      {{ t('admin.markets') }}
    </h1>
    <DataTable :value="(data?.data ?? []) as any[]" size="small">
      <Column field="slug" :header="t('admin.table.slug')" />
      <Column :header="t('admin.table.title')">
        <template #body="{ data: row }">
          {{ row.market_translations?.[0]?.title ?? '—' }}
        </template>
      </Column>
      <Column :header="t('admin.table.status')">
        <template #body="{ data: row }">
          <Tag :value="t(`marketStatus.${row.status}`)" />
        </template>
      </Column>
      <Column :header="t('admin.table.actions')">
        <template #body="{ data: row }">
          <Button
            v-if="row.status === 'review'"
            size="small"
            :label="t('admin.publish')"
            :loading="acting === row.id"
            @click="publish(row.id)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
