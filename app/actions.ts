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
    return { monthlyStats: {} }
  }

  // Add this line:
  console.log("getStatsData: Session found?", !!session, "User ID:", session?.user?.id)

  const { data, error } = await supabase.from("user_stats").select("stats_data").eq("user_id", session.user.id).single()

  if (error && error.code !== "PGRST116") {
    throw new Error("Failed to load statistics from database.")
  }

  revalidatePath("/stats")
  revalidatePath("/profile")

  if (data) {
    return data.stats_data as StatsData
  } else {
    return { monthlyStats: {} }
  }
}
