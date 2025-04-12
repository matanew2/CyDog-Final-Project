"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth/auth-provider"
import { API, socketService, SocketEvent } from "@/services"

// Types
export interface Dog {
  id: string
  name: string
  breed: string
  age: number
  type: string
  image?: string
  handlerId?: string
}

export interface Handler {
  id: string
  name: string
  jobTitle: string
  image?: string
}

export interface Assignment {
  id: string
  type: string
  dogId: string
  handlerId: string
  status: "Active" | "Completed" | "Pending"
  createdAt: string
  completedAt?: string
  description?: string
}

// App context type
interface AppContextType {
  dogs: Dog[]
  handlers: Handler[]
  assignments: Assignment[]
  activeDogs: Dog[]
  addDog: (dog: Omit<Dog, "id">) => Promise<void>
  addHandler: (handler: Omit<Handler, "id">) => Promise<void>
  addAssignment: (assignment: Omit<Assignment, "id" | "createdAt">) => Promise<void>
  updateAssignmentStatus: (id: string, status: Assignment["status"]) => Promise<void>
  getDogById: (id: string) => Dog | undefined
  getHandlerById: (id: string) => Handler | undefined
  getAssignmentById: (id: string) => Assignment | undefined
  getAssignmentsByDogId: (dogId: string) => Assignment[]
  getAssignmentsByHandlerId: (handlerId: string) => Assignment[]
  isLoading: boolean
  refreshData: () => Promise<void>
}

// Create app context
const AppContext = createContext<AppContextType | undefined>(undefined)

// Mock data
const mockDogs: Dog[] = [
  {
    id: "1203978120381",
    name: "Marvin",
    breed: "Golden Retriever",
    age: 3,
    type: "Search & Rescue",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "1203978120382",
    name: "Rex",
    breed: "German Shepherd",
    age: 4,
    type: "Search & Rescue",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "1203978120383",
    name: "Bella",
    breed: "Border Collie",
    age: 2,
    type: "Search & Rescue",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "1203978120384",
    name: "Max",
    breed: "Labrador Retriever",
    age: 5,
    type: "Search & Rescue",
    image: "/placeholder.svg?height=200&width=200",
  },
]

const mockHandlers: Handler[] = [
  {
    id: "202312211",
    name: "Daniela Vardi",
    jobTitle: "Senior Handler",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "202312212",
    name: "John Smith",
    jobTitle: "Handler",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "202312213",
    name: "Emma Johnson",
    jobTitle: "Junior Handler",
    image: "/placeholder.svg?height=200&width=200",
  },
]

const mockAssignments: Assignment[] = [
  {
    id: "assignment1",
    type: "Search & Rescue",
    dogId: "1203978120381",
    handlerId: "202312211",
    status: "Active",
    createdAt: "24/01/24 - 13:03",
    description:
      "Urban search for a missing person. Searching abandoned buildings and construction sites. Dog must navigate through debris and tight spaces. Ui amet ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
  },
  {
    id: "assignment2",
    type: "Search & Rescue",
    dogId: "1203978120382",
    handlerId: "202312212",
    status: "Active",
    createdAt: "24/01/24 - 13:04",
  },
  {
    id: "assignment3",
    type: "Search & Rescue",
    dogId: "1203978120383",
    handlerId: "202312213",
    status: "Pending",
    createdAt: "24/01/24 - 13:05",
  },
  {
    id: "assignment4",
    type: "Search & Rescue",
    dogId: "1203978120381",
    handlerId: "202312211",
    status: "Completed",
    createdAt: "23/01/24 - 10:30",
    completedAt: "23/01/24 - 14:45",
  },
]

// App provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [dogs, setDogs] = useState<Dog[]>(mockDogs)
  const [handlers, setHandlers] = useState<Handler[]>(mockHandlers)
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Initialize data and socket connection
  useEffect(() => {
    if (user) {
      refreshData()

      // Initialize socket connection
      const token = localStorage.getItem("auth_token")
      if (token) {
        socketService.init(token).catch((error) => {
          console.error("Socket connection failed:", error)
          toast({
            title: "Connection Error",
            description: "Failed to establish real-time connection. Some features may be limited.",
            variant: "destructive",
          })
        })

        // Set up socket event listeners
        setupSocketListeners()
      }
    }

    return () => {
      // Clean up socket connection on unmount
      socketService.disconnect()
    }
  }, [user])

  // Set up socket event listeners
  const setupSocketListeners = () => {
    // Add error handling for socket connection
    socketService.on(SocketEvent.ERROR, (error) => {
      console.error("Socket connection error:", error)
      // Don't show toast for socket errors in preview environment
      // as they're expected when running in a restricted environment
    })

    // Listen for dog location updates
    socketService.on(SocketEvent.DOG_LOCATION_UPDATE, (data) => {
      console.log("Dog location update:", data)
      // In a real app, we would update the dog's location in state
    })

    // Listen for dog status updates
    socketService.on(SocketEvent.DOG_STATUS_UPDATE, (data) => {
      console.log("Dog status update:", data)
      // Update dog status in state
    })

    // Listen for command responses
    socketService.on(SocketEvent.DOG_COMMAND_RESPONSE, (data) => {
      console.log("Command response:", data)
      toast({
        title: "Command Response",
        description: `${data.success ? "Success" : "Failed"}: ${data.message || "Command processed"}`,
        variant: data.success ? "default" : "destructive",
      })
    })

    // Listen for assignment updates
    socketService.on(SocketEvent.ASSIGNMENT_UPDATED, (data) => {
      console.log("Assignment updated:", data)
      refreshData()
    })
  }

  // Refresh all data from API
  const refreshData = async () => {
    setIsLoading(true)
    try {
      // In a real app, we would fetch data from the API
      // For now, we'll use mock data with a delay to simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Fetch dogs
      const dogsResponse = await API.dogs.getAllDogs()
      if (dogsResponse.data) {
        setDogs(dogsResponse.data)
      } else {
        // Fallback to mock data
        setDogs(mockDogs)
      }

      // Fetch handlers
      const handlersResponse = await API.handlers.getAllHandlers()
      if (handlersResponse.data) {
        setHandlers(handlersResponse.data)
      } else {
        // Fallback to mock data
        setHandlers(mockHandlers)
      }

      // Fetch assignments
      const assignmentsResponse = await API.assignments.getAllAssignments()
      if (assignmentsResponse.data) {
        setAssignments(assignmentsResponse.data)
      } else {
        // Fallback to mock data
        setAssignments(mockAssignments)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Data Refresh Failed",
        description: "Could not load the latest data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Add a new dog
  const addDog = async (dog: Omit<Dog, "id">) => {
    setIsLoading(true)
    try {
      const response = await API.dogs.createDog(dog)

      if (response.data) {
        setDogs((prev) => [...prev, response.data!])
        toast({
          title: "Dog added",
          description: `${dog.name} has been added to the system.`,
        })
      } else {
        throw new Error(response.error || "Failed to add dog")
      }
    } catch (error) {
      console.error("Error adding dog:", error)
      toast({
        title: "Failed to add dog",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Add a new handler
  const addHandler = async (handler: Omit<Handler, "id">) => {
    setIsLoading(true)
    try {
      const response = await API.handlers.createHandler(handler)

      if (response.data) {
        setHandlers((prev) => [...prev, response.data!])
        toast({
          title: "Handler added",
          description: `${handler.name} has been added to the system.`,
        })
      } else {
        throw new Error(response.error || "Failed to add handler")
      }
    } catch (error) {
      console.error("Error adding handler:", error)
      toast({
        title: "Failed to add handler",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Add a new assignment
  const addAssignment = async (assignment: Omit<Assignment, "id" | "createdAt">) => {
    setIsLoading(true)
    try {
      const response = await API.assignments.createAssignment(assignment)

      if (response.data) {
        setAssignments((prev) => [...prev, response.data!])
        toast({
          title: "Assignment created",
          description: `A new ${assignment.type} assignment has been created.`,
        })
      } else {
        throw new Error(response.error || "Failed to create assignment")
      }
    } catch (error) {
      console.error("Error creating assignment:", error)
      toast({
        title: "Failed to create assignment",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update assignment status
  const updateAssignmentStatus = async (id: string, status: Assignment["status"]) => {
    setIsLoading(true)
    try {
      const response = await API.assignments.updateAssignmentStatus(id, status)

      if (response.data) {
        setAssignments((prev) =>
          prev.map((assignment) => {
            if (assignment.id === id) {
              return response.data!
            }
            return assignment
          }),
        )
        toast({
          title: "Assignment updated",
          description: `Assignment status changed to ${status}.`,
        })
      } else {
        throw new Error(response.error || "Failed to update assignment")
      }
    } catch (error) {
      console.error("Error updating assignment:", error)
      toast({
        title: "Failed to update assignment",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get dog by ID
  const getDogById = (id: string) => {
    return dogs.find((dog) => dog.id === id)
  }

  // Get handler by ID
  const getHandlerById = (id: string) => {
    return handlers.find((handler) => handler.id === id)
  }

  // Get assignment by ID
  const getAssignmentById = (id: string) => {
    return assignments.find((assignment) => assignment.id === id)
  }

  // Get assignments by dog ID
  const getAssignmentsByDogId = (dogId: string) => {
    return assignments.filter((assignment) => assignment.dogId === dogId)
  }

  // Get assignments by handler ID
  const getAssignmentsByHandlerId = (handlerId: string) => {
    return assignments.filter((assignment) => assignment.handlerId === handlerId)
  }

  // Get active dogs
  const activeDogs = dogs.filter((dog) => {
    return assignments.some((assignment) => assignment.dogId === dog.id && assignment.status === "Active")
  })

  return (
    <AppContext.Provider
      value={{
        dogs,
        handlers,
        assignments,
        activeDogs,
        addDog,
        addHandler,
        addAssignment,
        updateAssignmentStatus,
        getDogById,
        getHandlerById,
        getAssignmentById,
        getAssignmentsByDogId,
        getAssignmentsByHandlerId,
        isLoading,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use app context
export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
