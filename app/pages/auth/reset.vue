<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const { t } = useI18n()
const client = useSupabaseClient()

const email = ref('')
const pending = ref(false)
const sent = ref(false)

async function submit() {
  pending.value = true
  try {
    await client.auth.resetPasswordForEmail(email.value)
  } finally {
    sent.value = true
    pending.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-md py-[clamp(3rem,8vh,6rem)]">
    <h1 class="font-display mb-8 text-4xl tracking-[-0.03em]">{{ t('auth.resetPassword') }}</h1>
    <Message v-if="sent" severity="info" :closable="false">{{ t('auth.resetSent') }}</Message>
    <form v-else class="flex flex-col gap-5" @submit.prevent="submit">
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold" for="email">{{ t('auth.email') }}</label>
        <InputText id="email" v-model="email" type="email" required autocomplete="email" />
      </div>
      <Button type="submit" :label="t('auth.resetPassword')" :loading="pending" />
    </form>
  </div>
</template>
