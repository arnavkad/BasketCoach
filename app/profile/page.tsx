"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Award, Calendar, Edit, Target, Trophy, MoreHorizontal, X, User, TrendingUp } from "lucide-react"
import { useDevStats } from "@/contexts/dev-stats-context"
import type { MonthStats, SessionData, StatsData } from "@/types/stats"
import { getStatsData } from "@/app/actions"

export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [showAllAchievements, setShowAllAchievements] = useState(false)
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { devAccuracy, devSessions, devShots } = useDevStats()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
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
    fetchStats()
  }, [])

  const aggregatedTotalSessions = statsData
    ? Object.values(statsData.monthlyStats).reduce((sum, month) => sum + month.recentSessions.length, 0)
    : 0

  const aggregatedTotalShots = statsData
    ? Object.values(statsData.monthlyStats).reduce((sum, month) => sum + month.totalShots, 0)
    : 0

  const aggregatedAvgAccuracy = statsData
    ? Object.values(statsData.monthlyStats).reduce((sum, month) => sum + month.accuracy, 0) /
      Object.keys(statsData.monthlyStats).length
    : 0

  useEffect(() => {
    const savedImage = localStorage.getItem("smartshot-profile-image")
    if (savedImage) {
      setProfileImage(savedImage)
    }
  }, [])

  const handleProfileImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfileImage(result)
        localStorage.setItem("smartshot-profile-image", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const getMonthKey = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`
  }

  const calculateDailyGoals = () => {
    if (!statsData) return []

    const goals = []
    const today = new Date()
    const currentMonthKey = getMonthKey(today)
    const monthStats: MonthStats | undefined = statsData.monthlyStats[currentMonthKey]

    const latestSession: SessionData | undefined = monthStats?.recentSessions.find((session) => {
      const sessionDate = new Date(session.date)
      return (
        sessionDate.getDate() === today.getDate() &&
        sessionDate.getMonth() === today.getMonth() &&
        sessionDate.getFullYear() === today.getFullYear()
      )
    })

    const currentDayData: SessionData = latestSession ||
      monthStats?.recentSessions[0] || {
        accuracy: 0,
        shots: 0,
        consecutiveShots: 0,
        date: today.toISOString().split("T")[0],
        duration: 0,
      }

    const currentAccuracy = currentDayData.accuracy
    const currentShots = currentDayData.shots
    const currentConsecutiveShots = currentDayData.consecutiveShots

    let dailyAccuracyGoal = 50
    while (dailyAccuracyGoal < currentAccuracy && dailyAccuracyGoal < 100) {
      dailyAccuracyGoal += 5
    }
    dailyAccuracyGoal = Math.min(dailyAccuracyGoal, 100)

    goals.push({
      type: "accuracy",
      target: dailyAccuracyGoal,
      current: currentAccuracy,
      description: `Reach ${dailyAccuracyGoal}% daily accuracy`,
      progress: (currentAccuracy / dailyAccuracyGoal) * 100,
    })

    let dailyShotsGoal = 25
    while (dailyShotsGoal < currentShots && dailyShotsGoal < 500) {
      dailyShotsGoal += 25
    }
    dailyShotsGoal = Math.min(dailyShotsGoal, 500)

    goals.push({
      type: "shots",
      target: dailyShotsGoal,
      current: currentShots,
      description: `Record ${dailyShotsGoal} daily shots`,
      progress: (currentShots / dailyShotsGoal) * 100,
    })

    let dailyConsecutiveGoal = 2
    while (dailyConsecutiveGoal < currentConsecutiveShots && dailyConsecutiveGoal < 50) {
      dailyConsecutiveGoal += 2
    }
    dailyConsecutiveGoal = Math.min(dailyConsecutiveGoal, 50)

    goals.push({
      type: "consecutive",
      target: dailyConsecutiveGoal,
      current: currentConsecutiveShots,
      description: `Achieve ${dailyConsecutiveGoal} consecutive shots`,
      progress: (currentConsecutiveShots / dailyConsecutiveGoal) * 100,
    })

    return goals
  }

  const achievements = [
    { name: "On the Board", description: "50% Accuracy", unlocked: devAccuracy >= 50, icon: "🎯" },
    { name: "Reliable Range", description: "70% Accuracy", unlocked: devAccuracy >= 70, icon: "🔥" },
    { name: "Sharpshooter", description: "90% Accuracy", unlocked: devAccuracy >= 90, icon: "⭐" },
    { name: "Textbook Arc", description: "Ideal Curve", unlocked: devAccuracy >= 85, icon: "📈" },
    { name: "Hot Hand", description: "10 Consecutive Makes", unlocked: devAccuracy >= 80, icon: "🔥" },
    { name: "Repetition Master", description: "100 Shots in a Single Session", unlocked: devShots >= 100, icon: "🏆" },
  ]

  const displayedAchievements = showAllAchievements ? achievements : achievements.slice(0, 3)
  const dailyGoals = calculateDailyGoals()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <User className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Profile Header */}
        <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-white h-24"></div>
          <CardContent className="p-8 -mt-12 relative">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-xl">
                    MJ
                  </div>
                )}
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 bg-white border-2 hover:bg-slate-50 shadow-lg"
                  onClick={handleProfileImageClick}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Michael Jordan</h1>
                  <p className="text-slate-500 text-lg">@airjordan23</p>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  {[
                    { label: "Sessions", value: aggregatedTotalSessions },
                    { label: "Total Shots", value: aggregatedTotalShots.toLocaleString() },
                    { label: "Avg Accuracy", value: `${aggregatedAvgAccuracy.toFixed(0)}%` },
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-orange-500">{stat.value}</div>
                      <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Achievements */}
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader className="relative">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-orange-500" />
                Achievements
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-8 w-8 hover:bg-slate-100"
                onClick={() => setShowAllAchievements(!showAllAchievements)}
              >
                {showAllAchievements ? <X className="h-4 w-4" /> : <MoreHorizontal className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayedAchievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      achievement.unlocked
                        ? "bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200"
                        : "bg-slate-50 border border-slate-200"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                        achievement.unlocked
                          ? "bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg"
                          : "bg-slate-300"
                      }`}
                    >
                      {achievement.unlocked ? (
                        <span>{achievement.icon}</span>
                      ) : (
                        <Award className="h-5 w-5 text-orange-500" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${achievement.unlocked ? "text-slate-900" : "text-slate-500"}`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm ${achievement.unlocked ? "text-slate-600" : "text-slate-400"}`}>
                        {achievement.unlocked ? achievement.description : `Locked - ${achievement.description}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Daily Goals */}
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-500" />
                Daily Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dailyGoals.map((goal, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-900">{goal.description}</span>
                      <span className="text-sm text-slate-500 font-medium">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-slate-500">{Math.min(goal.progress, 100).toFixed(0)}% complete</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statsData?.monthlyStats[getMonthKey(new Date())]?.recentSessions.length > 0 ? (
                statsData.monthlyStats[getMonthKey(new Date())].recentSessions.slice(0, 3).map((session, i) => {
                  const date = new Date(session.date)
                  const formattedDate = date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })

                  return (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{formattedDate}</div>
                        <div className="text-sm text-slate-500">
                          Training session • {session.shots} shots • {session.duration} minutes
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">{session.accuracy}%</div>
                        <div className="text-xs text-slate-500">accuracy</div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-orange-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No recent session data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
