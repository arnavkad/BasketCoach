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
    console.error("No active session found for getStatsData:", sessionError?.message)
    // Return an empty StatsData object if no user is logged in
    return { monthlyStats: {} }
  }

  const { data, error } = await supabase.from("user_stats").select("stats_data").eq("user_id", session.user.id).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 means "No rows found"
    console.error("Error fetching stats data from Supabase:", error.message)
    throw new Error("Failed to load statistics from database.")
  }

  // Revalidate the paths to ensure the latest data is shown on these pages
  revalidatePath("/stats")
  revalidatePath("/profile")

  if (data) {
    return data.stats_data as StatsData
  } else {
    // Return an empty StatsData object if no data is found for the user
    return { monthlyStats: {} }
  }
}

/**
 * Server Action to generate and save mock statistics data for the logged-in user.
 * This function simulates data generation and saves it to Supabase.
 *
 * TODO: Connect your actual backend here to generate real data.
 * For example, you might call an external API or run a complex calculation.
 */
export async function generateAndSaveMockData(): Promise<void> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    console.error("No active session found for generateAndSaveMockData:", sessionError?.message)
    throw new Error("You must be logged in to generate data.")
  }

  const userId = session.user.id
  const today = new Date()
  const currentMonthKey = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}`
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const dayBeforeYesterday = new Date(today)
  dayBeforeYesterday.setDate(today.getDate() - 2)

  const mockStats: StatsData = {
    monthlyStats: {
      "2025-07": {
        // Hardcoding July for consistent testing
        accuracy: Math.floor(Math.random() * (90 - 70 + 1)) + 70, // 70-90%
        shotsForSession: Math.floor(Math.random() * (70 - 40 + 1)) + 40, // 40-70 shots
        totalShots: Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000, // 2000-3000 total
        accuracyGraph: Array.from({ length: 7 }, () => Math.floor(Math.random() * (90 - 60 + 1)) + 60),
        shotsForSessionGraph: Array.from({ length: 7 }, () => Math.floor(Math.random() * (60 - 30 + 1)) + 30),
        totalShotsGraph: Array.from({ length: 7 }, () => Math.floor(Math.random() * (500 - 200 + 1)) + 200),
        recentSessions: [
          {
            date: today.toISOString().split("T")[0],
            shots: Math.floor(Math.random() * (70 - 50 + 1)) + 50,
            duration: Math.floor(Math.random() * (35 - 25 + 1)) + 25,
            accuracy: Math.floor(Math.random() * (90 - 75 + 1)) + 75,
            consecutiveShots: Math.floor(Math.random() * (25 - 15 + 1)) + 15,
          },
          {
            date: yesterday.toISOString().split("T")[0],
            shots: Math.floor(Math.random() * (60 - 40 + 1)) + 40,
            duration: Math.floor(Math.random() * (30 - 20 + 1)) + 20,
            accuracy: Math.floor(Math.random() * (85 - 70 + 1)) + 70,
            consecutiveShots: Math.floor(Math.random() * (20 - 10 + 1)) + 10,
          },
          {
            date: dayBeforeYesterday.toISOString().split("T")[0],
            shots: Math.floor(Math.random() * (55 - 35 + 1)) + 35,
            duration: Math.floor(Math.random() * (28 - 18 + 1)) + 18,
            accuracy: Math.floor(Math.random() * (80 - 65 + 1)) + 65,
            consecutiveShots: Math.floor(Math.random() * (18 - 8 + 1)) + 8,
          },
        ],
      },
      "2025-06": {
        // Hardcoding June for consistent testing
        accuracy: Math.floor(Math.random() * (85 - 65 + 1)) + 65,
        shotsForSession: Math.floor(Math.random() * (60 - 35 + 1)) + 35,
        totalShots: Math.floor(Math.random() * (2500 - 1800 + 1)) + 1800,
        accuracyGraph: Array.from({ length: 7 }, () => Math.floor(Math.random() * (85 - 55 + 1)) + 55),
        shotsForSessionGraph: Array.from({ length: 7 }, () => Math.floor(Math.random() * (50 - 25 + 1)) + 25),
        totalShotsGraph: Array.from({ length: 7 }, () => Math.floor(Math.random() * (400 - 150 + 1)) + 150),
        recentSessions: [
          {
            date: "2025-06-25",
            shots: Math.floor(Math.random() * (60 - 40 + 1)) + 40,
            duration: Math.floor(Math.random() * (30 - 20 + 1)) + 20,
            accuracy: Math.floor(Math.random() * (80 - 65 + 1)) + 65,
            consecutiveShots: Math.floor(Math.random() * (15 - 8 + 1)) + 8,
          },
          {
            date: "2025-06-24",
            shots: Math.floor(Math.random() * (50 - 30 + 1)) + 30,
            duration: Math.floor(Math.random() * (25 - 15 + 1)) + 15,
            accuracy: Math.floor(Math.random() * (75 - 60 + 1)) + 60,
            consecutiveShots: Math.floor(Math.random() * (12 - 5 + 1)) + 5,
          },
        ],
      },
    },
  }

  const { error } = await supabase.from("user_stats").upsert(
    { user_id: userId, stats_data: mockStats },
    { onConflict: "user_id" }, // Update if user_id exists, insert otherwise
  )

  if (error) {
    console.error("Error saving mock data to Supabase:", error.message)
    throw new Error("Failed to save mock data.")
  }
  console.log("Mock stats data generated and saved successfully for user:", userId)
}

// TODO: Your Google Colab backend should handle inserting/updating data into the 'user_stats' table in Supabase.
// This `updateStatsData` function is no longer directly called from the frontend,
// but it shows the expected structure if you were to update data from a server-side context.
export async function updateStatsData(newData: StatsData): Promise<void> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    console.error("No active session found for updateStatsData:", sessionError?.message)
    throw new Error("You must be logged in to update data.")
  }

  const userId = session.user.id

  const { error } = await supabase.from("user_stats").upsert(
    { user_id: userId, stats_data: newData },
    { onConflict: "user_id" }, // Update if user_id exists, insert otherwise
  )

  if (error) {
    console.error("Error saving data to Supabase:", error.message)
    throw new Error("Failed to save data.")
  }
  console.log("Stats data updated successfully for user:", userId)
}
