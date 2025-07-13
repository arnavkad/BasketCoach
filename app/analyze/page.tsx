"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Camera, Play, Square, Upload } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function AnalyzePage() {
  const { isLoggedIn, isLoading } = useAuth() // Get isLoading
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlayingFile, setIsPlayingFile] = useState(false)
  const [feedback, setFeedback] = useState<string[]>([])
  const [accuracy, setAccuracy] = useState(0)
  const [shotCount, setShotCount] = useState(0)
  const isMobile = useMobile()

  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isRecordingVideo, setIsRecordingVideo] = useState(false)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isMobile ? "environment" : "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsRecording(true)
        setIsPlayingFile(false)
        setRecordedVideoUrl(null)
        setFeedback(["Camera ready - click record to start"])
        setShotCount(0)
        setAccuracy(0)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setFeedback(["Camera access denied. Please check permissions."])
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsRecording(false)
    }
  }

  const handleFileImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && videoRef.current) {
      // Stop camera if it's running
      if (isRecording) {
        stopCamera()
      }

      const url = URL.createObjectURL(file)
      videoRef.current.src = url
      videoRef.current.load()
      setIsPlayingFile(true)
      setFeedback(["Analyzing imported video..."])
      setShotCount(0)
      setAccuracy(0)

      // Clean up the object URL when the video is loaded
      videoRef.current.onloadeddata = () => {
        URL.revokeObjectURL(url)
      }
    }
  }

  const startVideoRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" })
        const url = URL.createObjectURL(blob)
        setRecordedVideoUrl(url)
        setIsRecordingVideo(false)

        // Stop camera and show recorded video
        stopCamera()
        if (videoRef.current) {
          videoRef.current.src = url
          videoRef.current.srcObject = null
        }
        setFeedback(["Video recorded successfully! Review your shooting form."])
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecordingVideo(true)
      setFeedback(["Recording in progress..."])
    }
  }

  const stopVideoRecording = () => {
    if (mediaRecorder && isRecordingVideo) {
      mediaRecorder.stop()
    }
  }

  const startNewRecording = () => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl)
      setRecordedVideoUrl(null)
    }
    setFeedback([])
    setShotCount(0)
    setAccuracy(0)
    startCamera()
  }

  const toggleCamera = () => {
    if (isRecordingVideo) {
      stopVideoRecording()
    } else if (isRecording && !recordedVideoUrl) {
      startVideoRecording()
    } else if (isRecording) {
      stopCamera()
    } else {
      startCamera()
    }
  }

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      // Only redirect if not loading and not logged in
      router.push("/login")
    }
  }, [isLoggedIn, isLoading, router])

  useEffect(() => {
    if (isRecording || isPlayingFile) {
      const interval = setInterval(() => {
        const newFeedback = [...feedback]
        const feedbackOptions = [
          "Good elbow alignment",
          "Increase arc on your shot",
          "Follow through with your wrist",
          "Keep your shooting hand centered",
          "Good balance on release",
        ]

        if (newFeedback.length > 3) {
          newFeedback.shift()
        }

        newFeedback.push(feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)])
        setFeedback(newFeedback)

        if (Math.random() > 0.7) {
          setShotCount((prev) => prev + 1)
          setAccuracy((prev) => {
            const newAcc = prev + (Math.random() * 10 - 5)
            return Math.min(Math.max(newAcc, 0), 100)
          })
        }
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [isRecording, isPlayingFile, feedback])

  // Don't render the page content if loading or not logged in
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

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-6 h-20 flex items-center bg-white border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                  {!isRecording && !isPlayingFile && !recordedVideoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                          <Camera className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                          <p className="text-gray-300">Start your camera to begin recording</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                {recordedVideoUrl ? (
                  <Button onClick={startNewRecording} size="lg" className="px-8 bg-orange-500 hover:bg-orange-600">
                    <Play className="mr-2 h-5 w-5" />
                    New Recording
                  </Button>
                ) : (
                  <Button
                    onClick={toggleCamera}
                    size="lg"
                    className={`px-8 ${
                      isRecordingVideo
                        ? "bg-red-500 hover:bg-red-600"
                        : isRecording
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >
                    {isRecordingVideo ? (
                      <>
                        <Square className="mr-2 h-5 w-5" />
                        Stop Recording
                      </>
                    ) : isRecording ? (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Start Recording
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-5 w-5" />
                        Start Camera
                      </>
                    )}
                  </Button>
                )}

                <Button
                  onClick={handleFileImport}
                  size="lg"
                  variant="outline"
                  className="px-8 border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Import Video
                </Button>

                <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{shotCount}</div>
                  <div className="text-slate-500">Shots</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{accuracy.toFixed(0)}%</div>
                  <div className="text-slate-500">Accuracy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Stats */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Shot Accuracy</span>
                      <span className="font-medium">{accuracy.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${accuracy}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Form Consistency</span>
                      <span className="font-medium">{Math.min(shotCount * 5, 85).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(shotCount * 5, 85)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2"></div>
                    <span className="text-gray-600">Keep your elbow aligned with the basket</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2"></div>
                    <span className="text-gray-600">Follow through with your wrist</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2"></div>
                    <span className="text-gray-600">Maintain consistent release point</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
