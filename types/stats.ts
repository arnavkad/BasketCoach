export interface SessionData {
  date: string
  shots: number
  duration: number
  accuracy: number
  consecutiveShots: number
}

export interface MonthStats {
  accuracy: number
  shotsForSession: number
  totalShots: number
  accuracyGraph: number[]
  shotsForSessionGraph: number[]
  totalShotsGraph: number[]
  recentSessions: SessionData[]
}

export interface StatsData {
  monthlyStats: {
    [key: string]: MonthStats // Key will be "YYYY-MM"
  }
}
