import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// -----------------------------------------------------------------------------
// 1. Read Supabase public keys from the environment.
//    Accessible at build-time and run-time on both server and client.
// -----------------------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ""

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ""

// -----------------------------------------------------------------------------
// 2. Implement Singleton Pattern for Supabase Client
//    This ensures only one instance is created and reused across the app.
// -----------------------------------------------------------------------------
let supabase: SupabaseClient<any, any, any> | undefined // Use undefined initially

// Check if the Supabase client has already been initialized
if (!supabase) {
  // Log to see if this block is entered (should be once per server/client context)
  console.log("V0_DEBUG: Attempting to initialize Supabase client (singleton check).")

  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    // Log if real credentials are used
    console.log("V0_DEBUG: Supabase client initialized with REAL credentials (singleton).")
  } else {
    // -----------------------------------------------------------------------------
    // 3. ⚠️  Dev / Preview fallback  ⚠️
    //    If no real keys are found, we export a *mock* Supabase client.
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

    // This warning is the key indicator if env vars are missing in production
    console.warn(
      "V0_DEBUG: ⚠️  Supabase environment variables are missing.\n" +
        "For production, add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project.\n" +
        "A mock Supabase client is being used for local preview/missing config.",
    )

    supabase = mock()
  }
}

export { supabase }
