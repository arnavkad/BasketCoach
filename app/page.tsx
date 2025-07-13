"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SmartShotLogo } from "@/components/logo"
import { Camera, TrendingUp, Target, ArrowRight, Play, Star } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { isLoggedIn, isLoading, logout } = useAuth() // Get isLoading

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading authentication state...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <SmartShotLogo className="h-8 w-8 text-white" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              SmartShot
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {isLoggedIn && (
              <>
                <Link href="/analyze" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                  Analyze
                </Link>
                <Link href="/stats" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                  Stats
                </Link>
                <Link href="/profile" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                  Profile
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <Link href="/login">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 border-0">
                  Get Started
                </Button>
              </Link>
            ) : (
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                onClick={logout}
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  <Star className="h-4 w-4" />
                  AI-Powered Basketball Training
                </div>

                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                      Perfect Your
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                      Basketball Shot
                    </span>
                  </h1>
                  <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                    Get real-time AI feedback on your shooting form. Track progress, improve accuracy, and become the
                    player you've always wanted to be.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {isLoggedIn ? (
                    <Link href="/analyze">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/25 px-8 py-4 text-lg group"
                      >
                        Start Training
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/25 px-8 py-4 text-lg group"
                      >
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  )}
                  <Link href="/how-it-works">
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 py-4 text-lg border-slate-300 hover:bg-slate-50 group bg-transparent"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Watch Demo
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative animate-fade-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl blur-3xl opacity-20"></div>
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-2xl">
                    <img
                      alt="Basketball player shooting"
                      className="object-cover object-right w-full h-full"
                      src="/images/launchpad-basketball.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Everything You Need to Improve</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Advanced AI technology meets professional basketball training
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Camera,
                  title: "Real-Time Analysis",
                  description:
                    "Get instant feedback on your shooting form with our advanced computer vision technology.",
                  gradient: "from-blue-500 to-blue-600",
                },
                {
                  icon: TrendingUp,
                  title: "Progress Tracking",
                  description: "Monitor your improvement over time with detailed analytics and performance insights.",
                  gradient: "from-green-500 to-green-600",
                },
                {
                  icon: Target,
                  title: "Personalized Tips",
                  description: "Receive customized coaching advice based on your unique shooting patterns and goals.",
                  gradient: "from-purple-500 to-purple-600",
                },
              ].map((feature, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl blur-xl from-orange-400 to-orange-600"></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1">
                    <div
                      className={`w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Transform Your Game?</h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of players who have improved their shooting accuracy with SmartShot's AI-powered training.
            </p>
            {!isLoggedIn && (
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold shadow-xl"
                >
                  Start Your Free Trial
                </Button>
              </Link>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-white text-slate-900 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <SmartShotLogo className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">SmartShot</span>
            </div>
            <p className="text-slate-600">© 2025 SmartShot. All rights reserved.</p>
            {/* Removed Terms and Privacy links */}
          </div>
        </div>
      </footer>
    </div>
  )
}
