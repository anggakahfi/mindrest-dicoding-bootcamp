// Mock data for low-fidelity prototype
// No real API calls - just static data for UI demonstration

export type StressLevel = "Rendah" | "Sedang" | "Tinggi"

export interface User {
  id: string
  name: string
  email: string
  age: number
  gender: "male" | "female"
}

export interface CheckIn {
  id: string
  userId: string
  journalText: string
  checkinDate: string
  createdAt: string
  prediction?: Prediction
}

export interface Prediction {
  id: string
  checkinId: string
  stressLevel: StressLevel
  stressScore: number
  recommendation: string
  createdAt: string
}

// Mock user for prototype
export const mockUser: User = {
  id: "uuid-xxxx",
  name: "Hayqal Akbar",
  email: "hayqal@email.com",
  age: 22,
  gender: "male",
}

// Mock history data
export const mockHistory: CheckIn[] = [
  {
    id: "uuid-1",
    userId: "uuid-xxxx",
    journalText:
      "Hari ini saya merasa sangat tertekan karena deadline pekerjaan menumpuk dan kurang tidur semalam. Badan terasa lelah dan pikiran tidak bisa berhenti memikirkan pekerjaan.",
    checkinDate: "2026-04-18",
    createdAt: "2026-04-18T10:30:00.000Z",
    prediction: {
      id: "pred-1",
      checkinId: "uuid-1",
      stressLevel: "Tinggi",
      stressScore: 0.87,
      recommendation:
        "Coba luangkan 10 menit untuk pernapasan dalam sebelum tidur.",
      createdAt: "2026-04-18T10:30:05.000Z",
    },
  },
  {
    id: "uuid-2",
    userId: "uuid-xxxx",
    journalText:
      "Pagi ini agak sibuk dengan meeting, tapi masih bisa handle. Sempat olahraga ringan dan makan teratur.",
    checkinDate: "2026-04-17",
    createdAt: "2026-04-17T09:15:00.000Z",
    prediction: {
      id: "pred-2",
      checkinId: "uuid-2",
      stressLevel: "Sedang",
      stressScore: 0.54,
      recommendation:
        "Sempatkan istirahat sejenak dari layar dan tarik napas panjang selama beberapa menit.",
      createdAt: "2026-04-17T09:15:05.000Z",
    },
  },
  {
    id: "uuid-3",
    userId: "uuid-xxxx",
    journalText:
      "Hari yang menyenangkan! Bisa selesaikan semua tugas tepat waktu dan sempat jalan-jalan sore.",
    checkinDate: "2026-04-16",
    createdAt: "2026-04-16T18:00:00.000Z",
    prediction: {
      id: "pred-3",
      checkinId: "uuid-3",
      stressLevel: "Rendah",
      stressScore: 0.15,
      recommendation:
        "Pertahankan kebiasaan baikmu hari ini. Tidur cukup untuk menjaga energimu tetap stabil.",
      createdAt: "2026-04-16T18:00:05.000Z",
    },
  },
  {
    id: "uuid-4",
    userId: "uuid-xxxx",
    journalText:
      "Ada konflik kecil dengan rekan kerja, tapi sudah diselesaikan. Masih merasa sedikit terganggu.",
    checkinDate: "2026-04-15",
    createdAt: "2026-04-15T14:30:00.000Z",
    prediction: {
      id: "pred-4",
      checkinId: "uuid-4",
      stressLevel: "Sedang",
      stressScore: 0.62,
      recommendation:
        "Cobalah berbicara dengan seseorang yang kamu percaya tentang perasaanmu hari ini.",
      createdAt: "2026-04-15T14:30:05.000Z",
    },
  },
  {
    id: "uuid-5",
    userId: "uuid-xxxx",
    journalText:
      "Weekend yang produktif. Bisa istirahat cukup dan quality time dengan keluarga.",
    checkinDate: "2026-04-14",
    createdAt: "2026-04-14T20:00:00.000Z",
    prediction: {
      id: "pred-5",
      checkinId: "uuid-5",
      stressLevel: "Rendah",
      stressScore: 0.22,
      recommendation:
        "Bagus! Teruskan menjaga keseimbangan antara kerja dan istirahat.",
      createdAt: "2026-04-14T20:00:05.000Z",
    },
  },
  {
    id: "uuid-6",
    userId: "uuid-xxxx",
    journalText:
      "Deadline project besar besok, harus lembur malam ini. Cukup stres tapi berusaha tetap fokus.",
    checkinDate: "2026-04-13",
    createdAt: "2026-04-13T22:00:00.000Z",
    prediction: {
      id: "pred-6",
      checkinId: "uuid-6",
      stressLevel: "Tinggi",
      stressScore: 0.78,
      recommendation:
        "Jangan lupa minum air dan istirahat sejenak setiap 1-2 jam untuk menjaga fokus.",
      createdAt: "2026-04-13T22:00:05.000Z",
    },
  },
  {
    id: "uuid-7",
    userId: "uuid-xxxx",
    journalText:
      "Hari biasa saja, tidak ada yang terlalu menekan. Sempat nonton film untuk relaksasi.",
    checkinDate: "2026-04-12",
    createdAt: "2026-04-12T21:00:00.000Z",
    prediction: {
      id: "pred-7",
      checkinId: "uuid-7",
      stressLevel: "Rendah",
      stressScore: 0.28,
      recommendation:
        "Aktivitas hiburan seperti menonton film bagus untuk menjaga kesehatan mental.",
      createdAt: "2026-04-12T21:00:05.000Z",
    },
  },
]

// Chart data for last 7 days
export const mockChartData = mockHistory.slice(0, 7).map((item) => ({
  date: new Date(item.checkinDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  }),
  score: item.prediction?.stressScore ?? 0,
  level: item.prediction?.stressLevel ?? "Rendah",
}))

// Fallback recommendations
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
