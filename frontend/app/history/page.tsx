"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getStressColorClass } from "@/lib/mock-data"
import { checkinApi, predictionApi, type Checkin, type Prediction } from "@/lib/api"
import { TrendingUp, PenLine, FileText, Loader2 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <HistoryContent />
    </ProtectedRoute>
  )
}

interface ChartDataPoint {
  date: string
  score: number
  level: string
}

function HistoryContent() {
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [loadingChart, setLoadingChart] = useState(true)
  const [error, setError] = useState("")

  // Fetch checkin history
  useEffect(() => {
    checkinApi
      .getHistory(1, 20)
      .then((data) => {
        setCheckins(data.checkins)
      })
      .catch((err) => {
        setError("Gagal memuat riwayat jurnal")
        console.error(err)
      })
      .finally(() => setLoadingHistory(false))
  }, [])

  // Fetch prediction data for chart (last 7 days)
  useEffect(() => {
    predictionApi
      .getHistory(1, 7, 7)
      .then((data) => {
        const points: ChartDataPoint[] = data.predictions
          .map((p: Prediction) => ({
            date: new Date(p.checkin?.checkinDate || p.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            }),
            score: p.stressScore,
            level: p.stressLevel,
          }))
          .reverse() // oldest first for chart

        setChartData(points)
      })
      .catch((err) => {
        console.error("Failed to load chart data:", err)
      })
      .finally(() => setLoadingChart(false))
  }, [])

  const hasEnoughData = chartData.length >= 2

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Chart Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Tren Stresmu 7 Hari Terakhir</CardTitle>
            </div>
            <CardDescription>
              Grafik menunjukkan confidence score tingkat stres harian
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingChart ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : hasEnoughData ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      domain={[0, 1]}
                      ticks={[0, 0.25, 0.5, 0.75, 1]}
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                      tickFormatter={(value) => `${Math.round(value * 100)}%`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="rounded-lg border bg-card p-3 shadow-lg">
                              <p className="text-sm font-medium">{data.date}</p>
                              <p className="text-sm text-muted-foreground">
                                Score: {Math.round(data.score * 100)}%
                              </p>
                              <p className="text-sm text-muted-foreground">Level: {data.level}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-primary)", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "var(--color-primary)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Butuh minimal 2 data untuk melihat tren
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tulis jurnal harianmu untuk memulai pelacakan
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* History List Section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <FileText className="h-5 w-5 text-primary" />
            Riwayat Jurnal
          </h2>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {loadingHistory ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : checkins.length > 0 ? (
          <div className="flex flex-col gap-3">
            {checkins.map((entry) => (
              <Card key={entry._id} className="transition-shadow hover:shadow-md">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.checkinDate).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="mt-2 line-clamp-2 text-foreground">{entry.journalText}</p>
                    </div>
                    {entry.prediction && (
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getStressColorClass(entry.prediction.stressLevel)}`}
                      >
                        {entry.prediction.stressLevel}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <PenLine className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">Belum ada riwayat</h3>
              <p className="mt-1 text-muted-foreground">Mulai jurnal pertamamu sekarang!</p>
              <Link href="/home" className="mt-4">
                <Button>
                  <PenLine className="h-4 w-4" />
                  Tulis Jurnal
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
