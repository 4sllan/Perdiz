import { getQuery } from 'h3'
import { serverSupabaseClient } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const locale = ['br', 'us', 'pt', 'es'].includes(String(q.locale)) ? String(q.locale) : 'br'
  const status = String(q.status ?? 'open')
  const page = Math.max(1, Number(q.page) || 1)
  const perPage = Math.min(50, Math.max(1, Number(q.per_page) || 12))
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const supabase = serverSupabaseClient(event)
  let query = supabase
    .from('markets')
    .select(
      `id, slug, status, market_type, opens_at, closes_at,
       categories!inner(slug),
       market_translations!inner(title, description)`,
      { count: 'exact' },
    )
    .eq('market_translations.locale', locale)
    .eq('market_translations.publish_state', 'published')
    .order('closes_at', { ascending: true })
    .range(from, to)

  if (status !== 'all') {
    query = query.eq('status', status)
  }
  if (q.category) {
    query = query.eq('categories.slug', String(q.category))
  }
  if (q.q) {
    query = query.ilike('market_translations.title', `%${String(q.q)}%`)
  }

  const { data, error, count } = await query
  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'MARKETS_QUERY_FAILED' })
  }
  return { data: data ?? [], page, per_page: perPage, total: count ?? 0 }
})
