<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

async function onChange(code: string) {
  const path = switchLocalePath(code as Parameters<typeof switchLocalePath>[0])
  if (path) {
    await navigateTo(path)
  }
}
</script>

<template>
  <Select
    :model-value="locale"
    :options="locales"
    option-label="name"
    option-value="code"
    :aria-label="$t('locale.label')"
    size="small"
    @update:model-value="onChange"
  />
</template>
