/**
 * API Service
 * Handles all HTTP requests to the backend API
 */

import type { User } from "@/components/auth/auth-provider"
import type { Dog, Handler, Assignment } from "@/components/app/app-provider"

// Base API URL - would come from environment variables in a real app
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.cydog.com"

// Request options type
type RequestOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  headers?: Record<string, string>
  body?: any
}

// API response type
type ApiResponse<T> = {
  data?: T
  error?: string
  status: number
}

/**
 * Handles API requests with proper error handling and authentication
 */
async function apiRequest<T>(endpoint: string, options: RequestOptions): Promise<ApiResponse<T>> {
  try {
    // Get auth token from localStorage
    const token = localStorage.getItem("auth_token")

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    // Add auth token if available
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    // Prepare request body
    const requestOptions: RequestInit = {
      method: options.method,
      headers,
      credentials: "include", // Include cookies for CSRF protection
    }

    // Add body for non-GET requests
    if (options.body && options.method !== "GET") {
      requestOptions.body = JSON.stringify(options.body)
    }

    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions)

    // Parse response
    let data
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    // Handle response
    if (!response.ok) {
      return {
        error: data.message || "An error occurred",
        status: response.status,
      }
    }

    return {
      data,
      status: response.status,
    }
  } catch (error) {
    console.error("API request failed:", error)
    return {
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    }
  }
}

/**
 * Authentication API methods
 */
export const AuthApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    })
  },

  register: async (
    name: string,
    email: string,
    password: string,
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: { name, email, password },
    })
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return apiRequest("/auth/logout", {
      method: "POST",
    })
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiRequest("/auth/me", {
      method: "GET",
    })
  },
}

/**
 * Dogs API methods
 */
export const DogsApi = {
  getAllDogs: async (): Promise<ApiResponse<Dog[]>> => {
    return apiRequest("/dogs", {
      method: "GET",
    })
  },

  getDogById: async (id: string): Promise<ApiResponse<Dog>> => {
    return apiRequest(`/dogs/${id}`, {
      method: "GET",
    })
  },

  createDog: async (dog: Omit<Dog, "id">): Promise<ApiResponse<Dog>> => {
    return apiRequest("/dogs", {
      method: "POST",
      body: dog,
    })
  },

  updateDog: async (id: string, dog: Partial<Dog>): Promise<ApiResponse<Dog>> => {
    return apiRequest(`/dogs/${id}`, {
      method: "PUT",
      body: dog,
    })
  },

  deleteDog: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/dogs/${id}`, {
      method: "DELETE",
    })
  },

  getActiveDogs: async (): Promise<ApiResponse<Dog[]>> => {
    return apiRequest("/dogs/active", {
      method: "GET",
    })
  },
}

/**
 * Handlers API methods
 */
export const HandlersApi = {
  getAllHandlers: async (): Promise<ApiResponse<Handler[]>> => {
    return apiRequest("/handlers", {
      method: "GET",
    })
  },

  getHandlerById: async (id: string): Promise<ApiResponse<Handler>> => {
    return apiRequest(`/handlers/${id}`, {
      method: "GET",
    })
  },

  createHandler: async (handler: Omit<Handler, "id">): Promise<ApiResponse<Handler>> => {
    return apiRequest("/handlers", {
      method: "POST",
      body: handler,
    })
  },

  updateHandler: async (id: string, handler: Partial<Handler>): Promise<ApiResponse<Handler>> => {
    return apiRequest(`/handlers/${id}`, {
      method: "PUT",
      body: handler,
    })
  },

  deleteHandler: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/handlers/${id}`, {
      method: "DELETE",
    })
  },
}

/**
 * Assignments API methods
 */
export const AssignmentsApi = {
  getAllAssignments: async (): Promise<ApiResponse<Assignment[]>> => {
    return apiRequest("/assignments", {
      method: "GET",
    })
  },

  getAssignmentById: async (id: string): Promise<ApiResponse<Assignment>> => {
    return apiRequest(`/assignments/${id}`, {
      method: "GET",
    })
  },

  getAssignmentsByDogId: async (dogId: string): Promise<ApiResponse<Assignment[]>> => {
    return apiRequest(`/assignments/dog/${dogId}`, {
      method: "GET",
    })
  },

  getAssignmentsByHandlerId: async (handlerId: string): Promise<ApiResponse<Assignment[]>> => {
    return apiRequest(`/assignments/handler/${handlerId}`, {
      method: "GET",
    })
  },

  createAssignment: async (assignment: Omit<Assignment, "id" | "createdAt">): Promise<ApiResponse<Assignment>> => {
    return apiRequest("/assignments", {
      method: "POST",
      body: assignment,
    })
  },

  updateAssignmentStatus: async (id: string, status: Assignment["status"]): Promise<ApiResponse<Assignment>> => {
    return apiRequest(`/assignments/${id}/status`, {
      method: "PATCH",
      body: { status },
    })
  },

  deleteAssignment: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/assignments/${id}`, {
      method: "DELETE",
    })
  },
}

/**
 * Export a default API object with all services
 */
const API = {
  auth: AuthApi,
  dogs: DogsApi,
  handlers: HandlersApi,
  assignments: AssignmentsApi,
}

export default API
