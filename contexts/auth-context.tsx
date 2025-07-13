"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  isLoggedIn: boolean
  isLoading: boolean
  user: User | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  // 1️⃣  Get the initial session on first render
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data.session) {
          setIsLoggedIn(true)
          setUser(data.session.user)
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  // 2️⃣  Listen for future auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session))
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 3️⃣  Updated logout
  const logout = async () => {
    if (!isLoggedIn) return // Nothing to do

    setIsLoading(true)
    const { error } = await supabase.auth.signOut()

    // Supabase returns “Auth session missing!” if the session is already gone.
    if (error && error.message !== "Auth session missing!") {
      console.error("Error logging out:", error.message)
    }

    // Regardless of Supabase response, immediately reset local auth state.
    setIsLoggedIn(false)
    setUser(null)
    setIsLoading(false)
  }

  const login = () => {
    /* handled via <LoginPage /> */
  }

  return <AuthContext.Provider value={{ isLoggedIn, isLoading, user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
