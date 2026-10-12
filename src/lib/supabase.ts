import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseConfigurado = Boolean(url && key && !url.includes('SEU-PROJETO'))

export const supabase: SupabaseClient | null = supabaseConfigurado
  ? createClient(url!, key!, { auth: { persistSession: true, autoRefreshToken: true } })
  : null
