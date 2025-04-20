"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/auth-provider";
import { API, socketService, SocketEvent } from "@/services";
import { v4 as uuidv4 } from "uuid";

//TODO: Need to implement in the backend - convert RTSP to HLS (ffmpeg command) - send rtsp link and dogid
// TODO: Need to change in the backend the ffmpeg command to get rtsp stream instead of hardcoded stream in Dockerfile
// TODO: Need to implement in the backend - dogs will have a hlsUrl field (defined by dogId) that will be used to stream the video

// Types
export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  type: string;
  image?: string;
}

export interface Assignment {
  id: string;
  type: string;
  dogId: string;
  handlerId: string; // This will map to userId on the server
  status: "Active" | "Completed" | "Pending";
  createdAt: string;
  completedAt?: string;
  description?: string;
}

// App context type
interface AppContextType {
  dogs: Dog[];
  users: User[];
  assignments: Assignment[];
  activeDogs: Dog[];
  addDog: (dog: Dog | Omit<Dog, "id">, imageFile?: File) => Promise<Dog>;
  addAssignment: (
    assignment: Omit<Assignment, "id" | "createdAt">
  ) => Promise<void>;
  updateAssignment: (
    id: string,
    assignment: Partial<Assignment>
  ) => Promise<void>;
  getDogById: (id: string) => Dog | undefined;
  getUserById: (id: string) => User | undefined;
  getAssignmentById: (id: string) => Assignment | undefined;
  getAssignmentsByDogId: (dogId: string) => Assignment[];
  getAssignmentsByUserId: (userId: string) => Assignment[];
  updateAssignmentById: (
    id: string,
    status: Assignment["status"]
  ) => Promise<void>;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  convertRTSPToHLS: (rtspUrl: string, dogId: string) => Promise<string | void>;
}

// Create app context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Importing User type from auth-provider
import { User } from "@/components/auth/auth-provider";

// App provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Initialize data and socket connection
  useEffect(() => {
    if (user) {
      refreshData();

      // Initialize socket connection
      const token = localStorage.getItem("auth_token");
      if (token) {
        socketService.init(token).catch((error) => {
          console.error("Socket connection failed:", error);
          // Don't show error toast in preview mode
          if (
            !window.location.hostname.includes("vercel.app") &&
            !window.location.hostname.includes("preview") &&
            window.location.hostname !== "localhost"
          ) {
            toast({
              title: "Connection Error",
              description:
                "Failed to establish real-time connection. Some features may be limited.",
              variant: "destructive",
            });
          }
        });

        // Set up socket event listeners
        setupSocketListeners();
      }
    }

    return () => {
      // Clean up socket connection on unmount
      socketService.disconnect();
    };
  }, [user]);

  // Set up socket event listeners
  const setupSocketListeners = () => {
    // Add error handling for socket connection
    socketService.on(SocketEvent.ERROR, (error) => {
      console.error("Socket connection error:", error);
    });

    // Listen for dog location updates
    socketService.on(SocketEvent.DOG_LOCATION_UPDATE, (data) => {
      console.log("Dog location update:", data);
    });

    // Listen for dog status updates
    socketService.on(SocketEvent.DOG_STATUS_UPDATE, (data) => {
      console.log("Dog status update:", data);
    });

    // Listen for command responses
    socketService.on(SocketEvent.DOG_COMMAND_RESPONSE, (data) => {
      console.log("Command response:", data);
      toast({
        title: "Command Response",
        description: `${data.success ? "Success" : "Failed"}: ${
          data.message || "Command processed"
        }`,
        variant: data.success ? "default" : "destructive",
      });
    });

    // Listen for assignment updates
    socketService.on(SocketEvent.ASSIGNMENT_UPDATED, (data) => {
      console.log("Assignment updated:", data);
      refreshData();
    });
  };

  // Refresh all data from API
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Try fetching data from API first
      await fetchDogsData();
      await fetchUsersData();
      await fetchAssignmentsData(); // Uncomment this line
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Data Refresh Failed",
        description: "Could not load the latest data. Please try again.",
        variant: "warning",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch dogs data
  const fetchDogsData = async () => {
    try {
      const dogsResponse = await API.dogs.getAllDogs();

      if (dogsResponse?.data && Array.isArray(dogsResponse.data)) {
        setDogs(dogsResponse.data);
      } else if (dogsResponse?.data && typeof dogsResponse.data === "object") {
        console.log("Converting dogs data to array");
        const dogsArray = dogsResponse.data.data || [dogsResponse.data];
        setDogs(Array.isArray(dogsArray) ? dogsArray : []);
      } else {
        setDogs([]);
      }
    } catch (error) {
      console.error("Error fetching dogs:", error);
      setDogs([]);
    }
  };

  // Fetch users data
  const fetchUsersData = async () => {
    try {
      const usersResponse = await API.auth.getAllUsers();
      if (usersResponse?.data && Array.isArray(usersResponse.data)) {
        setUsers(usersResponse.data);
      } else if (
        usersResponse?.data &&
        typeof usersResponse.data === "object"
      ) {
        console.log("Converting users data to array");
        const usersArray = usersResponse.data.data || [usersResponse.data];
        setUsers(Array.isArray(usersArray) ? usersArray : []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  // Fetch assignments data with improved error handling
  const fetchAssignmentsData = async () => {
    try {
      // Try to fetch assignments from the API
      const assignmentsResponse = await API.assignments.getAllAssignments();

      if (
        assignmentsResponse?.data &&
        Array.isArray(assignmentsResponse.data)
      ) {
        // Map server-side userId to client-side handlerId
        const formattedAssignments = assignmentsResponse.data.map(
          (assignment) => ({
            ...assignment,
            handlerId: assignment.userId || assignment.handlerId,
          })
        );
        setAssignments(formattedAssignments);
      } else {
        // Set empty assignments array if no valid data
        setAssignments([]);
      }
    } catch (error) {
      // Handle 404 gracefully - the endpoint might not be set up yet
      console.warn("Note: Assignments API endpoint returned an error:", error);
      console.info(
        "This is expected if the assignments feature is not yet implemented"
      );

      // Just set empty assignments without showing an error message
      setAssignments([]);

      // Don't rethrow the error to prevent it from breaking the app flow
    }
  };

  // Add a new dog
  const addDog = async (
    dog: Dog | Omit<Dog, "id">,
    imageFile?: File
  ): Promise<Dog> => {
    setIsLoading(true);
    try {
      const dogWithId: Dog = "id" in dog ? dog : { ...dog, id: uuidv4() };

      const response = await API.dogs.createDog(dog, imageFile);

      if (response.data) {
        const addedDog = response.data;
        setDogs((prev) => [...prev, addedDog]);

        toast({
          title: "Dog added",
          description: `${addedDog.name} has been added to the system.`,
        });

        return addedDog;
      } else {
        throw new Error(response.error || "No data returned from server");
      }
    } catch (error) {
      console.error("Error adding dog:", error);
      toast({
        title: "Failed to add dog",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new assignment
  const addAssignment = async (
    assignment: Omit<Assignment, "id" | "createdAt">
  ) => {
    setIsLoading(true);
    try {
      const assignmentWithId: Assignment = {
        ...assignment,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };

      try {
        const response = await API.assignments.createAssignment(assignment);

        if (response?.data) {
          // Add handlerId to the returned data to match our client-side model
          const assignmentWithHandlerId = {
            ...response.data,
            handlerId: response.data.userId || assignment.handlerId,
          };
          setAssignments((prev) => [...prev, assignmentWithHandlerId]);
          toast({
            title: "Assignment created",
            description: `A new ${assignment.type} assignment has been created.`,
          });
        } else {
          // Don't add assignment if API returns no data
          toast({
            title: "Error creating assignment",
            description: "Server returned an invalid response.",
            variant: "destructive",
          });
          throw new Error("API returned no data");
        }
      } catch (apiError) {
        console.error("API Error creating assignment:", apiError);

        // Don't add assignment to local state
        toast({
          title: "Error creating assignment",
          description: "Could not create assignment due to server error.",
          variant: "destructive",
        });

        throw apiError;
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast({
        title: "Failed to create assignment",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update assignment
  const updateAssignment = async (
    id: string,
    assignment: Partial<Assignment>
  ) => {
    setIsLoading(true);
    try {
      // Don't update local state first, wait for API response

      try {
        const response = await API.assignments.updateAssignment(id, assignment);

        if (response?.data) {
          // Update with server data if available
          setAssignments((prev) =>
            prev.map((assignment) => {
              if (assignment.id === id) {
                return {
                  ...response.data!,
                  handlerId: response.data.userId || assignment.handlerId,
                };
              }
              return assignment;
            })
          );

          toast({
            title: "Assignment updated",
            description: `Assignment status changed to ${status}.`,
          });
        } else {
          // Don't update if API returns no data
          toast({
            title: "Error updating assignment",
            description: "Server returned an invalid response.",
            variant: "destructive",
          });
          throw new Error("API returned no data");
        }
      } catch (apiError) {
        console.error("API Error updating assignment:", apiError);

        // Don't update locally if API fails
        toast({
          title: "Error updating assignment",
          description: "Could not update assignment due to server error.",
          variant: "destructive",
        });

        throw apiError;
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast({
        title: "Failed to update assignment",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get dog by ID
  const getDogById = (id: string) => {
    return dogs.find((dog) => dog.id === id);
  };

  // Get user by ID (replaces getHandlerById)
  const getUserById = (id: string) => {
    return users.find((user) => user.id === id);
  };

  // Get assignment by ID
  const getAssignmentById = (id: string) => {
    return assignments.find((assignment) => assignment.id === id);
  };

  // Get assignments by dog ID
  const getAssignmentsByDogId = (dogId: string) => {
    return assignments.filter((assignment) => assignment.dogId === dogId);
  };

  // Get assignments by user ID (replaces getAssignmentsByHandlerId)
  const getAssignmentsByUserId = (userId: string) => {
    return assignments.filter((assignment) => assignment.handlerId === userId);
  };

  // Update assignment status by ID
  const updateAssignmentById = async (
    id: string,
    status: Assignment["status"]
  ) => {
    setIsLoading(true);
    try {
      const response = await API.assignments.updateAssignment(id, status);
      if (response?.data) {
        setAssignments((prev) =>
          prev.map((assignment) => {
            if (assignment.id === id) {
              return { ...assignment, status: response.data.status };
            }
            return assignment;
          })
        );
        toast({
          title: "Assignment updated",
          description: `Assignment status changed to ${status}.`,
        });
      } else {
        toast({
          title: "Error updating assignment",
          description: "Server returned an invalid response.",
          variant: "destructive",
        });
        throw new Error("API returned no data");
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast({
        title: "Failed to update assignment",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Convert RTSP to HLS (if needed)
  const convertRTSPToHLS = async (rtspUrl: string, dogId: string) => {
    // Check if the URL is valid
    if (!rtspUrl || !isValidUrl(rtspUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid RTSP URL.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await API.assignments.convertRTSPToHLS(rtspUrl, dogId);
      if (response?.data) {
        toast({
          title: "RTSP to HLS conversion",
          description: `RTSP URL converted to HLS: ${response.data.hlsUrl}`,
        });
        return response.data.hlsUrl;
      } else {
        toast({
          title: "Error converting RTSP to HLS",
          description: "Server returned an invalid response.",
          variant: "destructive",
        });
        throw new Error("API returned no data");
      }
    } catch (error) {
      console.error("Error converting RTSP to HLS:", error);
      toast({
        title: "Failed to convert RTSP to HLS",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Current code:
  const activeDogs =
    Array.isArray(dogs) && Array.isArray(assignments)
      ? dogs.filter((dog) => {
          return assignments.some(
            (assignment) =>
              assignment.dogId === dog.id && assignment.status === "Active"
          );
        })
      : [];

  return (
    <AppContext.Provider
      value={{
        dogs,
        users,
        assignments,
        activeDogs,
        addDog,
        addAssignment,
        updateAssignment,
        getDogById,
        getUserById,
        getAssignmentById,
        getAssignmentsByDogId,
        getAssignmentsByUserId,
        isLoading,
        refreshData,
        updateAssignmentById,
        convertRTSPToHLS,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use app context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
