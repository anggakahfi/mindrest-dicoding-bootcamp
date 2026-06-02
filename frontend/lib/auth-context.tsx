"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import { authApi, type User, type RegisterInput, ApiError } from "@/lib/api"

// =============================================================================
// Types
// =============================================================================

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterInput) => Promise<void>
  logout: () => void
}

// =============================================================================
// Context
// =============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// =============================================================================
// Provider
// =============================================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // ---------------------------------------------------------------------------
  // Auto-load: validate existing token on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const savedToken = localStorage.getItem("tweetmind_token")

    if (!savedToken) {
      setLoading(false)
      return
    }

    setToken(savedToken)

    authApi
      .getMe()
      .then((data) => {
        setUser(data.user)
      })
      .catch(() => {
        // Token invalid or expired — clear it
        localStorage.removeItem("tweetmind_token")
        setToken(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------
  const login = useCallback(
    async (email: string, password: string) => {
      const result = await authApi.login(email, password)
      localStorage.setItem("tweetmind_token", result.token)
      setToken(result.token)
      setUser(result.user)
      router.push("/home")
    },
    [router]
  )

  // ---------------------------------------------------------------------------
  // Register
  // ---------------------------------------------------------------------------
  const register = useCallback(
    async (data: RegisterInput) => {
      const result = await authApi.register(data)
      localStorage.setItem("tweetmind_token", result.token)
      setToken(result.token)
      setUser(result.user)
      router.push("/home")
    },
    [router]
  )

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------
  const logout = useCallback(() => {
    localStorage.removeItem("tweetmind_token")
    setToken(null)
    setUser(null)
    router.push("/")
  }, [router])

  // ---------------------------------------------------------------------------
  // Value
  // ---------------------------------------------------------------------------
  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// =============================================================================
// Hook
// =============================================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
