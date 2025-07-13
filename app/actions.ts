"use server"

import { supabase } from "@/lib/supabase"
import type { StatsData } from "@/types/stats"

export async function getStatsData(): Promise<StatsData> {
  try {
    // Get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Session error:", sessionError)
      return { monthlyStats: {} }
    }

    if (!session?.user) {
      console.log("No active session found")
      return { monthlyStats: {} }
    }

    console.log("Fetching stats for user:", session.user.id)

    // Fetch user stats from Supabase
    const { data, error } = await supabase
      .from("user_stats")
      .select("stats_data")
      .eq("user_id", session.user.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No data found for user - this is normal for new users
        console.log("No stats data found for user:", session.user.id)
        return { monthlyStats: {} }
      }
      console.error("Database error:", error)
      return { monthlyStats: {} }
    }

    if (!data?.stats_data) {
      console.log("Stats data is empty for user:", session.user.id)
      return { monthlyStats: {} }
    }

    console.log("Successfully fetched stats data for user:", session.user.id)
    return data.stats_data as StatsData
  } catch (error) {
    console.error("Unexpected error in getStatsData:", error)
    return { monthlyStats: {} }
  }
}
