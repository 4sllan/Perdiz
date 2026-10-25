import { createServerClient } from '@supabase/ssr'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { parseCookies, setCookie } from 'h3'

/**
 * Cliente Supabase por request, com sessão via cookies (SSR).
 * Usa a anon key — todo acesso passa por RLS como o usuário autenticado.
 */
export function serverSupabaseClient(event: H3Event): SupabaseClient {
  const config = useRuntimeConfig(event)

  return createServerClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
    cookies: {
      getAll() {
        return Object.entries(parseCookies(event)).map(([name, value]) => ({
          name,
          value,
        }))
      },
      setAll(cookies) {
        for (const { name, value, options } of cookies) {
          setCookie(event, name, value, options as never)
        }
      },
    },
  })
}

/**
 * Cliente privilegiado (service_role). Contorna RLS —
 * confinado ao servidor; jamais importar em código do cliente
 * nem expor a chave via runtimeConfig.public.
 */
export function serverSupabaseAdmin(event: H3Event): SupabaseClient {
  const config = useRuntimeConfig(event)

  return createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
