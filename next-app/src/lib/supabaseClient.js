import { createClient } from '@supabase/supabase-js'

// Primary Supabase instance
const supabaseUrl = 'https://lftmqrxyscqwiswoqxwk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdG1xcnh5c2Nxd2lzd29xeHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2OTYwMDIsImV4cCI6MjA3NDI3MjAwMn0.qLUK6DLgMWCvnfK9-kQ5LII8xKWXY5NXBDc4ex3W2TY'

// Secondary Supabase instance (for CK's database)
const supabaseUrlCk = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uxwvhexicgngleocseos.supabase.co'
const supabaseKeyCk = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4d3ZoZXhpY2duZ2xlb2NzZW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3ODQ0MDAsImV4cCI6MjA3NDM2MDQwMH0.o7ZYQaJxDY8g53EnwvuzOidNSQFroBH_YgfGM4NYDlY'

// Create single supabase client for primary database
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'enarxi-auth-token', // Unique storage key
  }
})

// Create separate client for CK's database with different storage key to avoid conflicts
export const supabaseCk = createClient(supabaseUrlCk, supabaseKeyCk, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'enarxi-ck-auth-token', // Different storage key to prevent conflicts
  }
})