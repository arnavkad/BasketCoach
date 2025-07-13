import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// -----------------------------------------------------------------------------
// 1. Grab NEXT_PUBLIC_ keys for client-side access (and server-side)
//    These are the correct prefixes for variables needed on the client.
// -----------------------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// -----------------------------------------------------------------------------
// 2. Implement Singleton Pattern for Supabase Client
//    This ensures only one instance is created and reused across the app.
// -----------------------------------------------------------------------------
let supabase: SupabaseClient<any, any, any> | undefined // Use undefined initially

// Check if the Supabase client has already been initialized
if (!supabase) {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
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
        "For production, add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project.\n" +
        "A mock Supabase client is being used for local preview.",
    )

    supabase = mock()
  }
}

export { supabase }
