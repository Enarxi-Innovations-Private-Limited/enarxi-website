import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lftmqrxyscqwiswoqxwk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdG1xcnh5c2Nxd2lzd29xeHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2OTYwMDIsImV4cCI6MjA3NDI3MjAwMn0.qLUK6DLgMWCvnfK9-kQ5LII8xKWXY5NXBDc4ex3W2TY'

export const supabase = createClient(supabaseUrl, supabaseKey)