import { readBody, getRouterParam } from 'h3'
import { serverSupabaseClient, serverSupabaseAdmin } from '../../../../utils/supabase'
import { requireRole } from '../../../../utils/auth'

const TRANSITIONS: Record<string, string[]> = {
  review: ['draft'],
  open: ['review'],
  paused: ['open'],
  closed: ['open', 'paused'],
  resolving: ['closed'],
}

export default defineEventHandler(async (event) => {
  await requireRole(event, ['admin', 'content_editor'])
  const id = getRouterParam(event, 'id')
  const body = await readBody(event).catch(() => ({}))
  const to = String(body?.to ?? 'open')

  const supabase = serverSupabaseClient(event)
  const { data: market } = await supabase
    .from('markets')
    .select('id, status')
    .eq('id', id ?? '')
    .maybeSingle()
  if (!market) {
    throw createError({ statusCode: 404, statusMessage: 'MARKET_NOT_FOUND' })
  }
  if (!(TRANSITIONS[to] ?? []).includes(market.status)) {
    throw createError({ statusCode: 409, statusMessage: 'INVALID_TRANSITION' })
  }

  const admin = serverSupabaseAdmin(event)
  const { error } = await admin
    .from('markets')
    .update({ status: to, updated_at: new Date().toISOString() })
    .eq('id', market.id)
  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'PUBLISH_FAILED' })
  }

  await admin
    .from('audit_logs')
    .insert({
      actor_user_id: event.context.user.id,
      action: `market.${to}`,
      entity_type: 'market',
      entity_id: market.id,
      reason: body?.reason ?? null,
    })
    .select()
    .maybeSingle()

  return { data: { id: market.id, status: to } }
})
