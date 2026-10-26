import type { User } from '@supabase/supabase-js'

interface MeResponse {
  user: { id: string; email: string | null } | null
  profile: Record<string, unknown> | null
  preferences: Record<string, unknown> | null
  roles?: string[]
}

export const useAuthUser = () => useState<User | null>('auth:user', () => null)
export const useAuthRoles = () => useState<string[]>('auth:roles', () => [])
export const useAuthPrefs = () => useState<Record<string, unknown> | null>('auth:prefs', () => null)

/** Atualiza user/roles/preferências a partir de /api/me (fonte: servidor). */
export async function refreshAuthState() {
  const me = await $fetch<MeResponse>('/api/me')
  const user = useAuthUser()
  const roles = useAuthRoles()
  const prefs = useAuthPrefs()
  roles.value = me.roles ?? []
  prefs.value = me.preferences ?? null
  return me
}

export function useAuth() {
  const user = useAuthUser()
  const roles = useAuthRoles()
  const client = useSupabaseClient()

  async function signOut() {
    await client.auth.signOut()
    user.value = null
    roles.value = []
    useAuthPrefs().value = null
    const localePath = useLocalePath()
    await navigateTo(localePath('/'))
  }

  function hasRole(role: string) {
    return roles.value.includes(role)
  }

  return { user, roles, hasRole, signOut }
}
