import { getRequestURL } from 'h3'
import { serverSupabaseClient } from '../utils/supabase'

/**
 * Resolve o usuário autenticado (via cookies da sessão Supabase) e o
 * disponibiliza em event.context.user para SSR e endpoints.
 */
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  if (path.startsWith('/_nuxt') || path.includes('.')) {
    return
  }

  try {
    const supabase = serverSupabaseClient(event)
    const { data, error } = await supabase.auth.getUser()
    event.context.user = error ? null : data.user
  } catch {
    event.context.user = null
  }
})
