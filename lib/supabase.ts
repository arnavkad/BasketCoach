import { createClient } from "@supabase/supabase-js"

// Ensure these are set in your environment variables
const supabaseUrl =  https://xffvyrkqhozuummsazxr.supabase.co/
const supabaseAnonKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnZ5cmtxaG96dXVtbXNhenhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODA5ODMsImV4cCI6MjA2Nzk1Njk4M30.CM6kAb4W6LnBN0lRJD3H-xQ8QcpSPRNjSmVxCcbYesA

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.")
}

// Create a single supabase client for the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
