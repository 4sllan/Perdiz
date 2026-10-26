<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const { t } = useI18n()
const client = useSupabaseClient()
const localePath = useLocalePath()

const email = ref('')
const password = ref('')
const pending = ref(false)
const errorMsg = ref('')

async function submit() {
  pending.value = true
  errorMsg.value = ''
  const { error } = await client.auth.signUp({
    email: email.value,
    password: password.value,
  })
  if (error) {
    errorMsg.value = error.message
    pending.value = false
    return
  }
  await refreshAuthState()
  await navigateTo(localePath('/'))
}
</script>

<template>
  <div class="mx-auto max-w-md py-[clamp(3rem,8vh,6rem)]">
    <h1 class="font-display mb-8 text-4xl tracking-[-0.03em]">{{ t('auth.register') }}</h1>
    <p class="text-muted mb-6 text-sm">{{ t('simulation.notice') }}</p>
    <form class="flex flex-col gap-5" @submit.prevent="submit">
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold" for="email">{{ t('auth.email') }}</label>
        <InputText id="email" v-model="email" type="email" required autocomplete="email" />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold" for="password">{{ t('auth.password') }}</label>
        <InputText
          id="password"
          v-model="password"
          type="password"
          required
          minlength="8"
          autocomplete="new-password"
        />
      </div>
      <Message v-if="errorMsg" severity="error" :closable="false">{{ errorMsg }}</Message>
      <Button type="submit" :label="t('auth.register')" :loading="pending" />
      <NuxtLinkLocale class="text-accent text-sm" to="/auth/login">{{
        t('auth.login')
      }}</NuxtLinkLocale>
    </form>
  </div>
</template>
