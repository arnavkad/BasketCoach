"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase" // Import Supabase client
import type { User } from "@supabase/supabase-js" // Import Supabase User type

interface AuthContextType {
  isLoggedIn: boolean
  isLoading: boolean // Add isLoading state
  user: User | null // Add user object
  login: () => void // These will be handled by Supabase internally
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Initialize as true
  const [user, setUser] = useState<User | null>(null) // Initialize user state

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsLoggedIn(true)
        setUser(session.user) // Set the user object
      } else {
        setIsLoggedIn(false)
        setUser(null) // Clear the user object
      }
      setIsLoading(false) // Set loading to false once auth state is determined
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // These functions will trigger Supabase auth methods,
  // and onAuthStateChanged will update the state accordingly.
  const login = () => {
    // This function is now a placeholder, actual login happens via Supabase signInWithPassword
    // The onAuthStateChanged listener will update isLoggedIn
  }

  const logout = async () => {
    setIsLoading(true) // Set loading to true during logout process
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error logging out:", error.message)
    }
    // onAuthStateChanged will handle setting isLoggedIn to false and isLoading to false
  }

  return <AuthContext.Provider value={{ isLoggedIn, isLoading, user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
