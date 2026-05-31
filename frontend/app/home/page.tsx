"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { checkinApi, predictionApi, ApiError } from "@/lib/api"
import { Sparkles, Loader2 } from "lucide-react"

const MIN_CHARS = 10
const MAX_CHARS = 1000

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  )
}

function HomeContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [journalText, setJournalText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const charCount = journalText.length
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setLoading(true)
    setError("")

    try {
      // Step 1: Create checkin (save journal to backend)
      const checkinResult = await checkinApi.create(journalText)
      const checkinId = checkinResult.checkin._id

      // Step 2: Create prediction for this checkin
      let predictionResult
      try {
        predictionResult = await predictionApi.create(checkinId)
      } catch (predErr) {
        // If prediction already exists (409), fetch it from history
        if (predErr instanceof ApiError && predErr.status === 409) {
          const historyResult = await predictionApi.getHistory(1, 1)
          if (historyResult.predictions.length > 0) {
            predictionResult = { prediction: historyResult.predictions[0] }
          }
        }
        if (!predictionResult) throw predErr
      }

      // Step 3: Store prediction result in sessionStorage for result page
      sessionStorage.setItem(
        "predictionResult",
        JSON.stringify(predictionResult.prediction)
      )

      // Step 4: Navigate to result page
      router.push("/result")
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Terjadi kesalahan saat menganalisis jurnal. Silakan coba lagi.")
      }
    } finally {
      setLoading(false)
    }
  }

  const firstName = user?.name?.split(" ")[0] || "User"

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Greeting Card */}
        <Card className="mb-6 border-none bg-primary/5">
          <CardContent className="py-6">
            <h2 className="text-xl font-semibold text-foreground">
              Halo, {firstName}!
            </h2>
            <p className="mt-1 text-muted-foreground">Bagaimana harimu?</p>
          </CardContent>
        </Card>

        {/* Journal Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Jurnal Harian
            </CardTitle>
            <CardDescription>
              Ceritakan kondisimu hari ini dalam teks bebas. Sistem akan menganalisis tingkat
              stresmu berdasarkan apa yang kamu tulis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Error Message */}
              {error && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <textarea
                  id="journal"
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value.slice(0, MAX_CHARS))}
                  placeholder="Contoh: Hari ini saya merasa sangat tertekan karena deadline pekerjaan menumpuk dan kurang tidur semalam..."
                  className="min-h-40 w-full resize-none rounded-lg border border-input bg-transparent p-4 text-base leading-relaxed placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:min-h-48"
                  aria-describedby="char-count"
                  disabled={loading}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Minimal {MIN_CHARS} karakter untuk analisis
                  </p>
                  <p
                    id="char-count"
                    className={`text-sm ${
                      charCount < MIN_CHARS
                        ? "text-muted-foreground"
                        : charCount > MAX_CHARS * 0.9
                          ? "text-stress-medium"
                          : "text-primary"
                    }`}
                  >
                    {charCount} / {MAX_CHARS}
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!isValid || loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analisis Stresku
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <div className="mt-6 rounded-lg bg-secondary/50 p-4">
          <h3 className="text-sm font-medium text-foreground">Tips Menulis Jurnal:</h3>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
            <li>Tulis dengan jujur tentang perasaanmu</li>
            <li>Ceritakan aktivitas dan kejadian hari ini</li>
            <li>Sebutkan hal yang membuatmu senang atau stres</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
