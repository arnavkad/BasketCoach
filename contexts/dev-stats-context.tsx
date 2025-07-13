"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface DevStatsContextType {
  devAccuracy: number
  setDevAccuracy: (accuracy: number) => void
  devSessions: number
  setDevSessions: (sessions: number) => void
  devShots: number
  setDevDevShots: (shots: number) => void
}

const DevStatsContext = createContext<DevStatsContextType | undefined>(undefined)

export function DevStatsProvider({ children }: { children: ReactNode }) {
  const [devAccuracy, setDevAccuracy] = useState(78)
  const [devSessions, setDevSessions] = useState(87)
  const [devShots, setDevDevShots] = useState(2450)

  useEffect(() => {
    // Load from localStorage
    const savedAccuracy = localStorage.getItem("smartshot-dev-accuracy")
    const savedSessions = localStorage.getItem("smartshot-dev-sessions")
    const savedShots = localStorage.getItem("smartshot-dev-shots")

    if (savedAccuracy) setDevAccuracy(Number(savedAccuracy))
    if (savedSessions) setDevSessions(Number(savedSessions))
    if (savedShots) setDevDevShots(Number(savedShots))
  }, [])

  useEffect(() => {
    // Save to localStorage whenever dev stats change
    localStorage.setItem("smartshot-dev-accuracy", devAccuracy.toString())
    localStorage.setItem("smartshot-dev-sessions", devSessions.toString())
    localStorage.setItem("smartshot-dev-shots", devShots.toString())
  }, [devAccuracy, devSessions, devShots])

  return (
    <DevStatsContext.Provider
      value={{ devAccuracy, setDevAccuracy, devSessions, setDevSessions, devShots, setDevDevShots }}
    >
      {children}
    </DevStatsContext.Provider>
  )
}

export function useDevStats() {
  const context = useContext(DevStatsContext)
  if (context === undefined) {
    throw new Error("useDevStats must be used within a DevStatsProvider")
  }
  return context
}
