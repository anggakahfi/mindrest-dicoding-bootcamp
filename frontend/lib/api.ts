// =============================================================================
// MindRest API Client
// Centralized HTTP client for all backend API calls
// =============================================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: { field: string; message: string }[]
}

export class ApiError extends Error {
  status: number
  errors?: { field: string; message: string }[]

  constructor(
    message: string,
    status: number,
    errors?: { field: string; message: string }[]
  ) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.errors = errors
  }
}

// -----------------------------------------------------------------------------
// Core fetch wrapper
// -----------------------------------------------------------------------------

async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("mindrest_token") : null

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const json: ApiResponse<T> = await response.json()

  if (!response.ok || !json.success) {
    throw new ApiError(
      json.message || "Terjadi kesalahan pada server",
      response.status,
      json.errors
    )
  }

  return json.data as T
}

// -----------------------------------------------------------------------------
// Auth API
// -----------------------------------------------------------------------------

export interface User {
  _id: string
  name: string
  email: string
  age: number
  gender: "male" | "female"
  createdAt: string
}

export interface AuthResult {
  user: User
  token: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  age: number
  gender: "male" | "female"
}

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data: RegisterInput) =>
    apiFetch<AuthResult>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: () => apiFetch<{ user: User }>("/auth/me"),
}

// -----------------------------------------------------------------------------
// Checkin API
// -----------------------------------------------------------------------------

export interface Checkin {
  _id: string
  userId: string
  journalText: string
  checkinDate: string
  createdAt: string
  updatedAt: string
  prediction?: PredictionSummary | null
}

export interface PredictionSummary {
  _id: string
  checkinId: string
  stressLevel: "Rendah" | "Sedang" | "Tinggi"
  stressScore: number
}

export interface PaginatedCheckins {
  checkins: Checkin[]
  pagination: Pagination
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const checkinApi = {
  create: (journalText: string) =>
    apiFetch<{ checkin: Checkin; isUpdated: boolean }>("/checkins", {
      method: "POST",
      body: JSON.stringify({ journalText }),
    }),

  getHistory: (page = 1, limit = 10) =>
    apiFetch<PaginatedCheckins>(`/checkins?page=${page}&limit=${limit}`),
}

// -----------------------------------------------------------------------------
// Prediction API
// -----------------------------------------------------------------------------

export interface Prediction {
  _id: string
  checkinId: string
  userId: string
  stressLevel: "Rendah" | "Sedang" | "Tinggi"
  stressScore: number
  recommendation: string
  createdAt: string
  updatedAt: string
  checkin?: {
    journalText: string
    checkinDate: string
  } | null
}

export interface PaginatedPredictions {
  predictions: Prediction[]
  pagination: Pagination
}

export const predictionApi = {
  create: (checkinId: string) =>
    apiFetch<{ prediction: Prediction }>("/predictions", {
      method: "POST",
      body: JSON.stringify({ checkinId }),
    }),

  getHistory: (page = 1, limit = 10, days?: number) => {
    let url = `/predictions?page=${page}&limit=${limit}`
    if (days) url += `&days=${days}`
    return apiFetch<PaginatedPredictions>(url)
  },
}
