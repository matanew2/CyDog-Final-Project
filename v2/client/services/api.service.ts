import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import type { User } from "@/components/auth/auth-provider";
import type { Dog, Assignment } from "@/components/app/app-provider";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.cydog.com";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Generic request function
async function apiRequest<T>(
  endpoint: string,
  options: AxiosRequestConfig
): Promise<{ data?: T; error?: string; status: number }> {
  try {
    const response: AxiosResponse<T> = await api(endpoint, options);
    console.log(`[API] ${options.method} ${endpoint}`, response.data);
    return { data: response.data, status: response.status };
  } catch (err: any) {
    const status = err.response?.status || 500;
    const error = err.response?.data?.message || err.message || "Unknown error";
    console.error(`[API Error] ${options.method} ${endpoint}:`, error);
    return { error, status };
  }
}

// API Services
export const AuthApi = {
  login: (email: string, password: string) =>
    apiRequest<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      data: { email, password },
    }),

  register: (name: string, email: string, password: string) =>
    apiRequest<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      data: { name, email, password },
    }),

  logout: () => apiRequest<void>("/auth/logout", { method: "POST" }),

  getCurrentUser: () => apiRequest<User>("/auth/me", { method: "GET" }),

  getAllUsers: () => apiRequest<User[]>("/auth/all-users", { method: "GET" }),
};

export const DogsApi = {
  getAllDogs: () => apiRequest<Dog[]>("/dogs", { method: "GET" }),

  getDogById: (id: string) => apiRequest<Dog>(`/dogs/${id}`, { method: "GET" }),

  createDog: (dog: Omit<Dog, "id">, imageFile?: File) => {
    const formData = new FormData();
    formData.append("name", dog.name);
    formData.append("breed", dog.breed);
    formData.append("age", String(dog.age));
    formData.append("type", dog.type);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    return apiRequest<Dog>("/dogs", {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateDog: (id: string, dog: Partial<Dog>, imageFile?: File) => {
    const formData = new FormData();
    if (dog.name) formData.append("name", dog.name);
    if (dog.breed) formData.append("breed", dog.breed);
    if (dog.age !== undefined) formData.append("age", String(dog.age));
    if (dog.type) formData.append("type", dog.type);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    return apiRequest<Dog>(`/dogs/${id}`, {
      method: "PUT",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteDog: (id: string) =>
    apiRequest<void>(`/dogs/${id}`, { method: "DELETE" }),
};

export const AssignmentsApi = {
  getAllAssignments: () =>
    apiRequest<Assignment[]>("/assignments", { method: "GET" }),

  getAssignmentById: (id: string) =>
    apiRequest<Assignment>(`/assignments/${id}`, { method: "GET" }),

  getAssignmentsByDogId: (dogId: string) =>
    apiRequest<Assignment[]>(`/assignments/dog/${dogId}`, { method: "GET" }),

  getAssignmentsByUserId: (userId: string) =>
    apiRequest<Assignment[]>(`/assignments/user/${userId}`, { method: "GET" }),

  createAssignment: (assignment: Omit<Assignment, "id" | "createdAt">) => {
    const { handlerId, ...rest } = assignment;
    return apiRequest<Assignment>("/assignments", {
      method: "POST",
      data: { ...rest, userId: handlerId },
    });
  },

  updateAssignmentStatus: (id: string, status: Assignment["status"]) =>
    apiRequest<Assignment>(`/assignments/${id}`, {
      method: "PATCH",
      data: { status },
    }),

  deleteAssignment: (id: string) =>
    apiRequest<void>(`/assignments/${id}`, { method: "DELETE" }),
};

// Export unified API
const API = {
  auth: AuthApi,
  dogs: DogsApi,
  assignments: AssignmentsApi,
};

export default API;
