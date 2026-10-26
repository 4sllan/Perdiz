import { getQuery } from 'h3'
import { serverSupabaseClient } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  const locale = ['br', 'us', 'pt', 'es'].includes(String(getQuery(event).locale))
    ? String(getQuery(event).locale)
    : 'br'
  const supabase = serverSupabaseClient(event)
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, icon, sort_order, category_translations!inner(name)')
    .eq('category_translations.locale', locale)
    .order('sort_order')

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'CATEGORIES_QUERY_FAILED' })
  }
  return { data: data ?? [] }
})
