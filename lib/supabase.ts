import { createClient } from "@supabase/supabase-js"

// WARNING: Hardcoding sensitive API keys directly into client-side code is NOT recommended for production.
// This is for demonstration or quick local testing purposes only.
// For production, always use environment variables (e.g., NEXT_RUNTIME_PUBLIC_SUPABASE_URL).

const supabaseUrl = "https://xffvyrkqhozuummsazxr.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnZ5cmtxaG96dXVtbXNhenhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODA5ODMsImV4cCI6MjA2Nzk1Njk4M30.CM6kAb4W6LnBN0lRJD3H-xQ8QcpSPRNjSmVxCcbYesA"

// Create a single supabase client for the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
