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
import { API } from "@/services";

// User type definition
export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  permissions: string[];
}
// Auth context type definition
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Check for existing user session on mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await API.auth.getCurrentUser();

        if (response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
          router.push("/dashboard");
        }
      } catch (error) {
        console.warn("Failed to retrieve user session");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, [router]);

  // Handle auth response
  const handleAuthResponse = (response: any, action: string = "login") => {
    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Authentication failed: No data received");
    }

    const { user: userData, token } = response.data;

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("auth_token", token);

    if (action === "login") {
      router.push("/dashboard");
      console.log("Redirecting to dashboard");
    } else if (action === "register") {
      router.push("/login");
      console.log("Redirecting to login page");
    }
    return userData;
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await API.auth.login(email, password);
      const userData = handleAuthResponse(response);

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description:
          error instanceof Error
            ? error.message
            : "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await API.auth.register(name, email, password);
      const userData = handleAuthResponse(response, "register");

      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description:
          error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Login with Google function
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would redirect to Google OAuth
      toast({
        title: "Google login",
        description: "This feature is not yet implemented.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Logout function
  const logout = async () => {
    try {
      await API.auth.logout();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("auth_token");
      router.push("/");

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };
  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
  };

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
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
