/**
 * supabase.js — SolarAxis Monitor: Supabase Client (Singleton)
 * 
 * Reads credentials from Vite environment variables (.env).
 * NEVER hardcode keys here — use VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️  Missing Supabase env vars! Copy .env.example → .env and fill in your keys.\n' +
    '   VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set.'
  )
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    // Limit realtime connections to save resources
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
)
