import { serverSupabaseClient } from '../../../utils/supabase'
import { requireRole } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['admin', 'content_editor'])
  const supabase = serverSupabaseClient(event)
  const { data, error } = await supabase
    .from('markets')
    .select(
      `id, slug, status, market_type, opens_at, closes_at,
       categories(slug),
       market_translations(locale, title, publish_state)`,
    )
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'ADMIN_MARKETS_FAILED' })
  }
  return { data: data ?? [] }
})
