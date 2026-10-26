import { getQuery, getRouterParam } from 'h3'
import { serverSupabaseClient } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const q = getQuery(event)
  const locale = ['br', 'us', 'pt', 'es'].includes(String(q.locale)) ? String(q.locale) : 'br'

  const supabase = serverSupabaseClient(event)
  const { data: market, error } = await supabase
    .from('markets')
    .select(
      `id, slug, status, market_type, opens_at, closes_at, resolved_at,
       categories!inner(slug),
       market_translations!inner(title, description, resolution_rules, resolution_source_url),
       market_outcomes!market_outcomes_market_id_fkey(id, outcome_key, sort_order, is_winner)`,
    )
    .eq('slug', slug ?? '')
    .eq('market_translations.locale', locale)
    .eq('market_translations.publish_state', 'published')
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'MARKET_QUERY_FAILED' })
  }
  if (!market) {
    throw createError({ statusCode: 404, statusMessage: 'MARKET_NOT_FOUND' })
  }
  return { data: market }
})
