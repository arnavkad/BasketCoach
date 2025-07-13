import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Camera, Smartphone, TrendingUp } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 h-20 flex items-center border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold text-gray-900">How SmartShot Works</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Advanced AI technology analyzes your basketball shooting form in real-time, providing instant feedback to
              help you improve.
            </p>
          </div>
        </section>

        {/* Video Demo Section */}
        <section className="px-6 py-16 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/WuT95ks1Q_M"
                title="SmartShot Basketball Analysis Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Vision Analysis</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our advanced computer vision technology tracks your body movements and analyzes your shooting form
                    in real-time.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Feedback</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get immediate insights on your shooting technique, including elbow alignment, release point, and
                    follow-through.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Progress</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Monitor your improvement over time with detailed statistics and personalized recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Getting Started</h2>
              <p className="text-xl text-gray-600">Start improving your shot in just three simple steps</p>
            </div>

            <div className="space-y-12">
              <div className="flex items-center gap-8">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Position Your Device</h3>
                  <p className="text-gray-600">
                    Set up your phone or tablet where it can clearly capture your full shooting motion.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Recording</h3>
                  <p className="text-gray-600">
                    Open SmartShot and tap "Start Recording" to begin analyzing your shots.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Review & Improve</h3>
                  <p className="text-gray-600">
                    Get instant feedback and track your progress to become a better shooter.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <Link href="/analyze">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8 py-4 text-lg">
                  Start Training Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500">© 2025 SmartShot. All rights reserved.</p>
          {/* Removed Terms and Privacy links */}
        </div>
      </footer>
    </div>
  )
}
