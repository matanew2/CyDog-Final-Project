"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { jwtDecode } from "jwt-decode"

// User type definition
export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  role?: string
  permissions?: string[]
}

// JWT token payload type
interface JwtPayload {
  sub: string
  name?: string
  email: string
  picture?: string
  role?: string
  permissions?: string[]
  exp: number
}

// Auth context type definition
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  hasPermission: (permission: string) => boolean
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Check for existing user session on mount
  useEffect(() => {
    const checkUserSession = () => {
      const token = localStorage.getItem("auth_token")

      if (token) {
        try {
          // Verify token expiration
          const decoded = jwtDecode<JwtPayload>(token)
          const currentTime = Date.now() / 1000

          if (decoded.exp < currentTime) {
            // Token expired
            localStorage.removeItem("auth_token")
            localStorage.removeItem("user")
            setUser(null)
            setIsAuthenticated(false)
          } else {
            // Valid token
            const storedUser = localStorage.getItem("user")
            if (storedUser) {
              setUser(JSON.parse(storedUser))
              setIsAuthenticated(true)
            }
          }
        } catch (error) {
          // Invalid token
          console.error("Invalid token:", error)
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user")
        }
      }

      setIsLoading(false)
    }

    checkUserSession()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Validate credentials (in a real app, this would be done on the server)
      if (email !== "admin@cydog.com" && password !== "password123") {
        throw new Error("Invalid credentials")
      }

      // Mock user data and token
      const mockUser: User = {
        id: "user-1",
        name: email.split("@")[0],
        email,
        image: null,
        role: "admin",
        permissions: ["read:dogs", "write:dogs", "read:handlers", "write:handlers"],
      }

      // Create a mock JWT token (in a real app, this would come from the server)
      const expiresIn = 60 * 60 * 24 * 7 // 7 days
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJuYW1lIjoiJHttb2NrVXNlci5uYW1lfSIsImVtYWlsIjoiJHttb2NrVXNlci5lbWFpbH0iLCJyb2xlIjoiYWRtaW4iLCJwZXJtaXNzaW9ucyI6WyJyZWFkOmRvZ3MiLCJ3cml0ZTpkb2dzIiwicmVhZDpoYW5kbGVycyIsIndyaXRlOmhhbmRsZXJzIl0sImV4cCI6JHtNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKSArIGV4cGlyZXNJbn19.signature`

      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(mockUser))
      localStorage.setItem("auth_token", mockToken)

      toast({
        title: "Login successful",
        description: "Welcome back!",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Login with Google function
  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const mockUser: User = {
        id: "user-google-1",
        name: "Google User",
        email: "user@gmail.com",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=user-google-1",
        role: "handler",
        permissions: ["read:dogs", "read:handlers"],
      }

      // Create a mock JWT token
      const expiresIn = 60 * 60 * 24 * 7 // 7 days
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLWdvb2dsZS0xIiwibmFtZSI6Ikdvb2dsZSBVc2VyIiwiZW1haWwiOiJ1c2VyQGdtYWlsLmNvbSIsInJvbGUiOiJoYW5kbGVyIiwicGVybWlzc2lvbnMiOlsicmVhZDpkb2dzIiwicmVhZDpoYW5kbGVycyJdLCJleHAiOiR7TWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCkgKyBleHBpcmVzSW59fQ.signature`

      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(mockUser))
      localStorage.setItem("auth_token", mockToken)

      toast({
        title: "Google login successful",
        description: "Welcome back!",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Google login failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Validate input
      if (!name || !email || !password) {
        throw new Error("All fields are required")
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long")
      }

      // Mock user data
      const mockUser: User = {
        id: "user-" + Date.now(),
        name,
        email,
        image: null,
        role: "user",
        permissions: ["read:dogs"],
      }

      // Create a mock JWT token
      const expiresIn = 60 * 60 * 24 * 7 // 7 days
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLSR7RGF0ZS5ub3coKX0iLCJuYW1lIjoiJHtuYW1lfSIsImVtYWlsIjoiJHtlbWFpbH0iLCJyb2xlIjoidXNlciIsInBlcm1pc3Npb25zIjpbInJlYWQ6ZG9ncyJdLCJleHAiOiR7TWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCkgKyBleHBpcmVzSW59fQ.signature`

      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(mockUser))
      localStorage.setItem("auth_token", mockToken)

      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    localStorage.removeItem("auth_token")
    router.push("/")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  // Check if user has a specific permission
  const hasPermission = (permission: string) => {
    if (!user || !user.permissions) return false
    return user.permissions.includes(permission)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        isAuthenticated,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
