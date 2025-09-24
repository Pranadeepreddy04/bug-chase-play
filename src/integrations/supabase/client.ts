import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not configured. Authentication will not work until you set up your Supabase project.')
}

// Create client with fallback values to prevent errors
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)