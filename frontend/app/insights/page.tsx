"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, ExternalLink, AlertCircle } from "lucide-react"

export default function InsightsPage() {
  const [dashboardAvailable] = useState(true) // Toggle for demo purposes

  const handleOpenDashboard = () => {
    // In production, this would open the Streamlit dashboard
    // For prototype, we just show that it would open in a new tab
    window.open("https://streamlit.io", "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Insight Berbasis Data</h1>
          <p className="mt-2 text-muted-foreground">
            Lihat bagaimana pola teks berhubungan dengan tingkat stres berdasarkan data riset kami.
          </p>
        </div>

        {/* Dashboard Card */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Dashboard Interaktif</CardTitle>
            <CardDescription>
              Eksplorasi visualisasi data stres dari populasi pengguna
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {dashboardAvailable ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Dashboard interaktif tersedia di Streamlit. Anda dapat melihat analisis mendalam
                  tentang pola stres dan tren dari seluruh pengguna MindRest.
                </p>
                <Button onClick={handleOpenDashboard} className="mx-auto">
                  <ExternalLink className="h-4 w-4" />
                  Buka Dashboard
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <AlertCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Dashboard sedang tidak tersedia, coba lagi nanti
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="py-6">
              <h3 className="font-semibold text-foreground">Pola Kata Kunci</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Analisis kata-kata yang sering muncul dalam jurnal pengguna dengan tingkat stres
                tinggi vs rendah
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <h3 className="font-semibold text-foreground">Distribusi Stres</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Perbandingan tingkat stres berdasarkan demografis seperti usia dan jenis kelamin
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <h3 className="font-semibold text-foreground">Tren Waktu</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Pola stres berdasarkan hari dalam seminggu dan waktu penulisan jurnal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <h3 className="font-semibold text-foreground">Korelasi Aktivitas</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Hubungan antara aktivitas yang disebutkan dengan tingkat stres yang terdeteksi
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Data yang ditampilkan bersifat agregat dan anonim untuk menjaga privasi pengguna.
        </p>
      </main>
    </div>
  )
}
