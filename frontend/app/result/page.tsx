"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type StressLevel,
  getStressColorClass,
  getStressTextColorClass,
} from "@/lib/mock-data"
import { Leaf, History, PenLine, Loader2, Sparkles, Heart } from "lucide-react"
import type { Prediction } from "@/lib/api"

export default function ResultPage() {
  return (
    <ProtectedRoute>
      <ResultContent />
    </ProtectedRoute>
  )
}

function ResultContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [prediction, setPrediction] = useState<Prediction | null>(null)

  useEffect(() => {
    // Read prediction result stored by home page
    const stored = sessionStorage.getItem("predictionResult")
    if (!stored) {
      router.push("/home")
      return
    }

    try {
      const parsed: Prediction = JSON.parse(stored)
      setPrediction(parsed)
    } catch {
      router.push("/home")
      return
    }

    setLoading(false)
  }, [router])

  const handleNewJournal = () => {
    sessionStorage.removeItem("predictionResult")
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
              <h2 className="text-lg font-semibold text-foreground">Memuat hasil...</h2>
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

  const stressLevel = prediction.stressLevel as StressLevel
  const scorePercent = Math.round(prediction.stressScore * 100)

  // Use rich AI fields if available, fall back to single recommendation
  const ringkasan = prediction.ringkasan || ""
  const rekomendasi =
    prediction.rekomendasi?.length > 0
      ? prediction.rekomendasi
      : prediction.recommendation
        ? [prediction.recommendation]
        : []
  const pesanDukungan = prediction.pesanDukungan || ""

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
                className={`rounded-full px-6 py-2 text-2xl font-bold ${getStressColorClass(stressLevel)}`}
              >
                {stressLevel.toUpperCase()}
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
                    stressLevel === "Rendah"
                      ? "bg-stress-low"
                      : stressLevel === "Sedang"
                        ? "bg-stress-medium"
                        : "bg-stress-high"
                  }`}
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
              
              <p className={`text-2xl font-bold ${getStressTextColorClass(stressLevel)}`}>
                {scorePercent}% yakin
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ringkasan (Summary) Card */}
        {ringkasan && (
          <Card className="mb-4 border-primary/20 bg-primary/5">
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Ringkasan Kondisi</p>
                  <p className="mt-1 text-foreground">{ringkasan}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rekomendasi (Recommendations) Card */}
        {rekomendasi.length > 0 && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-5 w-5 text-primary" />
                Rekomendasi Untukmu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col gap-3">
                {rekomendasi.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <p className="text-foreground">{item}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Pesan Dukungan (Support Message) Card */}
        {pesanDukungan && (
          <Card className="mb-6 border-none bg-secondary/50">
            <CardContent className="py-5">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 shrink-0 text-stress-high" />
                <p className="italic text-foreground">&ldquo;{pesanDukungan}&rdquo;</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/history" className="flex-1">
            <Button className="w-full">
              <History className="h-4 w-4" />
              Lihat Riwayat
            </Button>
          </Link>
          <Button variant="outline" onClick={handleNewJournal} className="flex-1">
            <PenLine className="h-4 w-4" />
            Tulis Jurnal Baru
          </Button>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Hasil analisis telah tersimpan otomatis.{" "}
          <Link href="/history" className="font-medium text-primary hover:underline">
            Lihat riwayat
          </Link>
        </p>
      </main>
    </div>
  )
}
