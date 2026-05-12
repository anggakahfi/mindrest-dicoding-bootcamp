"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockUser } from "@/lib/mock-data"
import { Sparkles } from "lucide-react"

const MIN_CHARS = 10
const MAX_CHARS = 1000

export default function HomePage() {
  const router = useRouter()
  const [journalText, setJournalText] = useState("")

  const charCount = journalText.length
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      // Store journal text in sessionStorage for result page
      sessionStorage.setItem("journalText", journalText)
      router.push("/result")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Greeting Card */}
        <Card className="mb-6 border-none bg-primary/5">
          <CardContent className="py-6">
            <h2 className="text-xl font-semibold text-foreground">
              Halo, {mockUser.name.split(" ")[0]}!
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
              <div className="flex flex-col gap-2">
                <textarea
                  id="journal"
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value.slice(0, MAX_CHARS))}
                  placeholder="Contoh: Hari ini saya merasa sangat tertekan karena deadline pekerjaan menumpuk dan kurang tidur semalam..."
                  className="min-h-40 w-full resize-none rounded-lg border border-input bg-transparent p-4 text-base leading-relaxed placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:min-h-48"
                  aria-describedby="char-count"
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

              <Button type="submit" className="w-full" disabled={!isValid}>
                <Sparkles className="h-4 w-4" />
                Analisis Stresku
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
