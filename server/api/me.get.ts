import { serverSupabaseClient } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  const user = event.context.user ?? null
  if (!user) {
    return { user: null }
  }

  const supabase = serverSupabaseClient(event)
  const [profile, prefs, roles] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('user_preferences').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('user_roles').select('role').eq('user_id', user.id),
  ])

  return {
    user: { id: user.id, email: user.email ?? null },
    profile: profile.data ?? null,
    preferences: prefs.data ?? null,
    roles: (roles.data ?? []).map((r: { role: string }) => r.role),
  }
})
