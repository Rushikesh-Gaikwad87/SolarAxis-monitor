import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'REPLACE_WITH_YOUR_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'REPLACE_WITH_YOUR_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
