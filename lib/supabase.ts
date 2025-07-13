import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// -----------------------------------------------------------------------------
// 1. Grab runtime-public keys (Next.js 15 recommended for production)
//    We also fall back to older NEXT_PUBLIC_ and plain SUPABASE_ for dev flexibility.
// -----------------------------------------------------------------------------
const supabaseUrl =
  process.env.NEXT_RUNTIME_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey =
  process.env.NEXT_RUNTIME_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY

// -----------------------------------------------------------------------------
// 2. Create the Supabase client or a mock client for development/preview
// -----------------------------------------------------------------------------
let supabase: SupabaseClient<any, any, any>

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log("Supabase client initialized with real credentials.") // Add this log
} else {
  // -----------------------------------------------------------------------------
  // 3. ⚠️  Dev / Preview fallback  ⚠️
  //    If no real keys are found, we export a *mock* Supabase client.
  //    This prevents "Failed to fetch" errors in local/preview environments
  //    while still allowing the UI to render and interact with a "fake" backend.
  // -----------------------------------------------------------------------------
  /* eslint-disable @typescript-eslint/no-explicit-any */
  function mock(): SupabaseClient<any, any, any> {
    const err = (fn: string) => ({
      data: null,
      error: { message: `Supabase not configured – called ${fn}` },
    })

    return {
      auth: {
        signInWithPassword: async () => err("signInWithPassword"),
        signUp: async () => err("signUp"),
        signOut: async () => err("signOut"),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      },
      from() {
        return {
          select: () => err("select"),
          upsert: () => err("upsert"),
          insert: () => err("insert"),
        }
      },
    } as unknown as SupabaseClient<any, any, any>
  }

  console.warn(
    "⚠️  Supabase environment variables are missing.\n" +
      "For production, add NEXT_RUNTIME_PUBLIC_SUPABASE_URL and NEXT_RUNTIME_PUBLIC_SUPABASE_ANON_KEY in your Vercel project.\n" +
      "A mock Supabase client is being used for local preview.",
  )

  supabase = mock()
}

export { supabase }
