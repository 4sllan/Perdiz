import { z } from 'zod'
import { createError, readBody } from 'h3'
import { serverSupabaseClient } from '../../utils/supabase'

const bodySchema = z
  .object({
    locale: z.enum(['br', 'us', 'pt', 'es']).optional(),
    display_currency: z.enum(['BRL', 'USD', 'EUR']).optional(),
    timezone: z.string().max(64).nullable().optional(),
  })
  .strict()

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'UNAUTHENTICATED' })
  }

  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success || Object.keys(parsed.data).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'INVALID_BODY' })
  }

  const supabase = serverSupabaseClient(event)
  const { data, error } = await supabase
    .from('user_preferences')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'PREFERENCES_UPDATE_FAILED' })
  }
  return { preferences: data }
})
