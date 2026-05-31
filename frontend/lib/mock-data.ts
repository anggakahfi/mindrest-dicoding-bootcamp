// =============================================================================
// Shared types and helpers for stress level display
// Mock data has been removed — all data now comes from the backend API.
// =============================================================================

export type StressLevel = "Rendah" | "Sedang" | "Tinggi"

// Fallback recommendations (used by backend when FastAPI is unavailable)
export const fallbackRecommendations: Record<StressLevel, string> = {
  Rendah:
    "Pertahankan kebiasaan baikmu hari ini. Tidur cukup untuk menjaga energimu tetap stabil.",
  Sedang:
    "Sempatkan istirahat sejenak dari layar dan tarik napas panjang selama beberapa menit.",
  Tinggi:
    "Coba luangkan 10 menit untuk pernapasan dalam atau dengarkan musik tenang sebelum tidur.",
}

// Helper to get stress level color class
export function getStressColorClass(level: StressLevel): string {
  switch (level) {
    case "Rendah":
      return "bg-stress-low text-white"
    case "Sedang":
      return "bg-stress-medium text-foreground"
    case "Tinggi":
      return "bg-stress-high text-white"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function getStressTextColorClass(level: StressLevel): string {
  switch (level) {
    case "Rendah":
      return "text-stress-low"
    case "Sedang":
      return "text-stress-medium"
    case "Tinggi":
      return "text-stress-high"
    default:
      return "text-muted-foreground"
  }
}
