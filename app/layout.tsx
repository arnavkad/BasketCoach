import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { DevStatsProvider } from "@/contexts/dev-stats-context" // Import the new provider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmartShot - Perfect Your Basketball Shot",
  description: "AI-powered basketball shooting analysis and training",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DevStatsProvider>{children}</DevStatsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
