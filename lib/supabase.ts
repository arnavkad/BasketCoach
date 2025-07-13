import { createClient } from "@supabase/supabase-js"

// Prefer the new Next.js 15 “public-at-runtime” prefix.
// Falls back to the old NEXT_PUBLIC_* names (so it still works in local dev)
// and finally to the plain server-only names.
const supabaseUrl =
  process.env.NEXT_RUNTIME_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL

const supabaseAnonKey =
  process.env.NEXT_RUNTIME_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables.\n" +
      "Define either:\n" +
      "  • NEXT_RUNTIME_PUBLIC_SUPABASE_URL / NEXT_RUNTIME_PUBLIC_SUPABASE_ANON_KEY (recommended for Next 15)\n" +
      "  • NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (legacy)\n" +
      "  • or SUPABASE_URL / SUPABASE_ANON_KEY (server-only).",
  )
}

// Create a single supabase client for the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
