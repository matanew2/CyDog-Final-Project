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

// Function to create a properly formatted mock JWT token
function createMockJwtToken(payload: Partial<JwtPayload>): string {
  // Create a complete payload with required fields
  const fullPayload = {
    sub: payload.sub || `user-${Date.now()}`,
    name: payload.name || "User",
    email: payload.email || "user@example.com",
    role: payload.role || "user",
    permissions: payload.permissions || ["read:dogs"],
    exp: payload.exp || Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // Default 7 days
  };
  
  // Convert to base64
  const encodedPayload = btoa(JSON.stringify(fullPayload));
  
  // Create token parts (header is fixed for mock)
  const header = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
  const signature = "mockSignature123";
  
  // Return complete token
  return `${header}.${encodedPayload}.${signature}`;
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

      // Create a mock JWT token
      const mockToken = createMockJwtToken({
        sub: "user-1",
        name: mockUser.name,
        email: mockUser.email,
        role: "admin",
        permissions: ["read:dogs", "write:dogs", "read:handlers", "write:handlers"],
      });

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
      const mockToken = createMockJwtToken({
        sub: "user-google-1",
        name: "Google User",
        email: "user@gmail.com",
        role: "handler",
        permissions: ["read:dogs", "read:handlers"],
      });

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
      const mockToken = createMockJwtToken({
        sub: `user-${Date.now()}`,
        name,
        email,
        role: "user",
        permissions: ["read:dogs"],
      });

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
