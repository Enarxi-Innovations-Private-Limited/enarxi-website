import { createClient } from '@supabase/supabase-js';

// Use environment variables in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uxwvhexicgngleocseos.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4d3ZoZXhpY2duZ2xlb2NzZW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3ODQ0MDAsImV4cCI6MjA3NDM2MDQwMH0.o7ZYQaJxDY8g53EnwvuzOidNSQFroBH_YgfGM4NYDlY';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // For development only - disable email confirmation
    autoConfirmEmail: true,
    // For development only - disable phone confirmation
    autoConfirmPhone: true,
    // For development only - disable OTP verification
    disableSignupConfirmation: true
  },
  // Enable debug logging
  debug: true
});