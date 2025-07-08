import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const createClient = (url: string, key: string) => {
  return createSupabaseClient(url, key)
}
