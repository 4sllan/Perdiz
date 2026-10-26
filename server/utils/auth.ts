import { createError, type H3Event } from 'h3'
import { serverSupabaseAdmin } from './supabase'

export function requireUser(event: H3Event) {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'UNAUTHENTICATED' })
  }
  return user
}

/** Papel verificado no banco — nunca confiado a claims do cliente. */
export async function requireRole(event: H3Event, roles: string[]) {
  const user = requireUser(event)
  const admin = serverSupabaseAdmin(event)
  const { data } = await admin.from('user_roles').select('role').eq('user_id', user.id)
  const owned = (data ?? []).map((r: { role: string }) => r.role)
  if (!roles.some((r) => owned.includes(r))) {
    throw createError({ statusCode: 403, statusMessage: 'FORBIDDEN' })
  }
  return { user, roles: owned }
}
