import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://udmcoeycclxsdjgnxfwp.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_BfNASlynUTt-jW1NaxYTfw_00S28qa_'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
