import type { User } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const user = useAuthUser()

  if (import.meta.server) {
    // Preenche a partir do contexto resolvido por server/middleware/auth.
    const event = useRequestEvent()
    user.value = (event?.context.user as User | null) ?? null
  } else {
    const client = useSupabaseClient()
    client.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
      if (!session) {
        useAuthRoles().value = []
      }
    })
  }
})
