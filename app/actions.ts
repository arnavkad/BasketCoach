"use server"

import type { StatsData } from "@/types/stats"
import { supabase } from "@/lib/supabase" // Import Supabase client
import { revalidatePath } from "next/cache" // Import revalidatePath

/**
 * Server Action to get the current statistics data for the logged-in user.
 * Fetches data from Supabase.
 */
export async function getStatsData(): Promise<StatsData> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    // Log if no session is found (expected if user is not logged in)
    console.log("V0_DEBUG: getStatsData: No active session found. Returning empty stats. Error:", sessionError?.message)
    return { monthlyStats: {} }
  }

  // Log if a session is found, including the user ID
  console.log("V0_DEBUG: getStatsData: Session found. User ID:", session.user.id)

  const { data, error } = await supabase.from("user_stats").select("stats_data").eq("user_id", session.user.id).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 means "No rows found", which is not an error if a user simply has no stats yet.
    // Other errors should still be thrown.
    console.error("V0_DEBUG: Error fetching stats data from Supabase:", error.message)
    throw new Error("Failed to load statistics from database.")
  }

  // Log the data fetched from Supabase
  console.log("V0_DEBUG: Fetched data from Supabase:", data ? data.stats_data : "No data found for user.")

  // Revalidate paths to ensure the latest data is shown on these pages
  revalidatePath("/stats")
  revalidatePath("/profile")

  if (data) {
    return data.stats_data as StatsData
  } else {
    // Return an empty StatsData object if no data is found for the user
    return { monthlyStats: {} }
  }
}
