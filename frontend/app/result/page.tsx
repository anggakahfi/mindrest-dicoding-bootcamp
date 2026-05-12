"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type StressLevel,
  getStressColorClass,
  getStressTextColorClass,
  fallbackRecommendations,
} from "@/lib/mock-data"
import { Leaf, Save, PenLine, Loader2, CheckCircle2 } from "lucide-react"

// Mock prediction simulation
function simulatePrediction(): { level: StressLevel; score: number } {
  // Randomly generate a prediction for prototype
  const rand = Math.random()
  if (rand < 0.33) {
    return { level: "Rendah", score: 0.15 + Math.random() * 0.2 }
  } else if (rand < 0.66) {
    return { level: "Sedang", score: 0.4 + Math.random() * 0.25 }
  } else {
    return { level: "Tinggi", score: 0.7 + Math.random() * 0.25 }
  }
}

export default function ResultPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [prediction, setPrediction] = useState<{
    level: StressLevel
    score: number
    recommendation: string
  } | null>(null)

  useEffect(() => {
    // Check if journal text exists
    const journalText = sessionStorage.getItem("journalText")
    if (!journalText) {
      router.push("/home")
      return
    }

    // Simulate API loading delay
    const timer = setTimeout(() => {
      const result = simulatePrediction()
      setPrediction({
        ...result,
        recommendation: fallbackRecommendations[result.level],
      })
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  const handleSave = () => {
    setSaved(true)
    // In a real app, this would save to the backend
  }

  const handleNewJournal = () => {
    sessionStorage.removeItem("journalText")
    router.push("/home")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">Menganalisis jurnalmu...</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Mohon tunggu sebentar
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!prediction) return null

  const scorePercent = Math.round(prediction.score * 100)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-center text-xl font-semibold text-foreground">
          Hasil Analisis Stres
        </h1>

        {/* Main Result Card */}
        <Card className="mb-4">
          <CardHeader className="text-center">
            <CardDescription>Tingkat stres terdeteksi</CardDescription>
            <div className="mt-2 flex justify-center">
              <span
                className={`rounded-full px-6 py-2 text-2xl font-bold ${getStressColorClass(prediction.level)}`}
              >
                {prediction.level.toUpperCase()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {/* Confidence Score Gauge */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground">Confidence Score</p>
              
              {/* Simple Gauge */}
              <div className="relative h-4 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                    prediction.level === "Rendah"
                      ? "bg-stress-low"
                      : prediction.level === "Sedang"
                        ? "bg-stress-medium"
                        : "bg-stress-high"
                  }`}
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
              
              <p className={`text-2xl font-bold ${getStressTextColorClass(prediction.level)}`}>
                {scorePercent}% yakin
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recommendation Card */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="py-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary">Saran personal untukmu hari ini</p>
                <p className="mt-1 text-foreground">{prediction.recommendation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleSave}
            disabled={saved}
            className="flex-1"
          >
            {saved ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Tersimpan
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan ke Riwayat
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleNewJournal} className="flex-1">
            <PenLine className="h-4 w-4" />
            Tulis Jurnal Baru
          </Button>
        </div>

        {saved && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Hasil analisis telah disimpan.{" "}
            <Link href="/history" className="font-medium text-primary hover:underline">
              Lihat riwayat
            </Link>
          </p>
        )}
      </main>
    </div>
  )
}
