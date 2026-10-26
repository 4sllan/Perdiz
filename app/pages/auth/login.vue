<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const { t } = useI18n()
const client = useSupabaseClient()
const localePath = useLocalePath()
const { locale, setLocale } = useI18n()

const email = ref('')
const password = ref('')
const pending = ref(false)
const errorMsg = ref('')

async function submit() {
  pending.value = true
  errorMsg.value = ''
  const { error } = await client.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (error) {
    errorMsg.value = t('auth.errors.invalidCredentials')
    pending.value = false
    return
  }

  // Precedência de locale: perfil > cookie > navegador (spec §7.2).
  const me = await refreshAuthState()
  const profileLocale = (me.profile as { locale?: string } | null)?.locale
  if (profileLocale && profileLocale !== locale.value) {
    await setLocale(profileLocale as typeof locale.value)
  } else {
    await $fetch('/api/me/preferences', {
      method: 'PATCH',
      body: { locale: locale.value },
    })
  }
  await navigateTo(localePath('/'))
}
</script>

<template>
  <div class="mx-auto max-w-md py-[clamp(3rem,8vh,6rem)]">
    <h1 class="font-display mb-8 text-4xl tracking-[-0.03em]">{{ t('auth.login') }}</h1>
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
          autocomplete="current-password"
        />
      </div>
      <Message v-if="errorMsg" severity="error" :closable="false">{{ errorMsg }}</Message>
      <Button type="submit" :label="t('auth.login')" :loading="pending" />
      <div class="flex justify-between text-sm">
        <NuxtLinkLocale class="text-accent" to="/auth/register">{{
          t('auth.register')
        }}</NuxtLinkLocale>
        <NuxtLinkLocale class="text-muted" to="/auth/reset">{{
          t('auth.forgotPassword')
        }}</NuxtLinkLocale>
      </div>
    </form>
  </div>
</template>
