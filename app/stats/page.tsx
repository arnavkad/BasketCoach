"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, TrendingUp, RefreshCw, Activity } from "lucide-react" // Removed Brain icon
import type { MonthStats, StatsData } from "@/types/stats"
import { getStatsData } from "@/app/actions" // Removed generateAndSaveMockData

export default function StatsPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1))
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const data = await getStatsData()
      setStatsData(data)
    } catch (err) {
      console.error("Failed to fetch stats data:", err)
      setError("Failed to load statistics. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    console.log("Initial fetch triggered.")
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const getMonthKey = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`
  }

  const previousMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const nextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  const currentMonthKey = getMonthKey(currentDate)
  console.log("Current month key:", currentMonthKey)
  const monthStats: MonthStats = statsData?.monthlyStats[currentMonthKey] || {
    accuracy: 0,
    shotsForSession: 0,
    totalShots: 0,
    accuracyGraph: [],
    shotsForSessionGraph: [],
    totalShotsGraph: [],
    recentSessions: [],
  }
  console.log("Month stats for current month:", monthStats)

  const displayedAccuracy = monthStats.accuracy
  const displayedShotsForSession = monthStats.shotsForSession
  const displayedTotalShots = monthStats.totalShots

  const accuracyGraphData = monthStats.accuracyGraph
  const shotsForSessionGraphData = monthStats.shotsForSessionGraph
  const totalShotsGraphData = monthStats.totalShotsGraph

  const prevMonthDate = new Date(currentDate)
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1)
  const prevMonthKey = getMonthKey(prevMonthDate)
  const prevMonthStats: MonthStats | undefined = statsData?.monthlyStats[prevMonthKey]

  const accuracyDiff = prevMonthStats ? displayedAccuracy - prevMonthStats.accuracy : null
  const shotsForSessionDiff = prevMonthStats ? displayedShotsForSession - prevMonthStats.shotsForSession : null
  const totalShotsDiff = prevMonthStats ? displayedTotalShots - prevMonthStats.totalShots : null

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading statistics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Activity className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <Button onClick={fetchStats} className="bg-orange-500 hover:bg-orange-600 text-white">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 hover:bg-slate-50 bg-transparent"
              onClick={fetchStats}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {/* Removed Generate Mock Data Button */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Your Statistics
            </h1>
            <p className="text-slate-600 text-lg">Track your shooting progress and performance over time</p>
          </div>

          <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
            <Button variant="ghost" size="icon" onClick={previousMonth} className="h-10 w-10 hover:bg-slate-100">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold min-w-[140px] text-center px-4 py-2">{formatDate(currentDate)}</span>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-10 w-10 hover:bg-slate-100">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Shot Accuracy",
              value: `${displayedAccuracy}%`,
              diff: accuracyDiff,
              graphData: accuracyGraphData,
              color: "orange",
              maxValue: 100,
            },
            {
              title: "Shots per Session",
              value: displayedShotsForSession.toString(),
              diff: shotsForSessionDiff,
              graphData: shotsForSessionGraphData,
              color: "orange",
              maxValue: Math.max(...shotsForSessionGraphData, 60),
            },
            {
              title: "Total Shots",
              value: displayedTotalShots.toLocaleString(),
              diff: totalShotsDiff,
              graphData: totalShotsGraphData,
              color: "orange",
              maxValue: Math.max(...totalShotsGraphData, 500),
            },
          ].map((metric, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-700">{metric.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end gap-3">
                  <div className="text-3xl font-bold text-slate-900">{metric.value}</div>
                  {metric.diff !== null && (
                    <div
                      className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
                        metric.diff >= 0 ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                      }`}
                    >
                      <TrendingUp className={`h-3 w-3 mr-1 ${metric.diff < 0 ? "rotate-180" : ""}`} />
                      {Math.abs(metric.diff)}
                      {metric.title.includes("Total") ? "" : metric.title.includes("Accuracy") ? "%" : ""}
                    </div>
                  )}
                </div>
                <p className="text-slate-500 text-sm">
                  {metric.diff !== null ? "vs last month" : "No comparison data"}
                </p>
                <div className="h-16 flex items-end gap-1">
                  {metric.graphData.map((value, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 rounded-t transition-all duration-300 bg-gradient-to-t from-orange-500 to-orange-400`}
                      style={{
                        height: `${(value / metric.maxValue) * 64}px`,
                        opacity: 0.6 + (idx / (metric.graphData.length - 1)) * 0.4,
                      }}
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Sessions */}
        <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthStats.recentSessions.length > 0 ? (
                monthStats.recentSessions.map((session, i) => {
                  const date = new Date(session.date)
                  const formattedDate = date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })

                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{formattedDate}</div>
                          <div className="text-sm text-slate-500">
                            {session.shots} shots • {session.duration} minutes
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">{session.accuracy}%</div>
                        <div className="text-sm text-slate-500">accuracy</div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No session data available for this month</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
