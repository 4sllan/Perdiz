import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | undefined

/**
 * Cliente Supabase do navegador (anon key, sessão em cookies).
 * Singleton — seguro para o cliente porque todo acesso passa por RLS.
 */
export function useSupabaseClient(): SupabaseClient {
  if (!client) {
    const config = useRuntimeConfig()
    client = createBrowserClient(config.public.supabaseUrl, config.public.supabaseAnonKey)
  }
  return client
}
