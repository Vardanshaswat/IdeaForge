"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Debug function
  const debugAuth = (message: string, data?: any) => {
    console.log(`[AUTH DEBUG] ${message}`, data);
  };

  // Fetch current user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      debugAuth("Initializing auth...");
      try {
        const cookies = parseCookies();
        const token = cookies.authToken;
        debugAuth("Token from cookies:", token);

        if (!token) {
          debugAuth("No token found, user not authenticated");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        debugAuth("Auth check response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          debugAuth("Auth check response data:", data);

          if (data.success && data.user) {
            debugAuth("Setting user:", data.user);
            setUser(data.user);
          } else {
            debugAuth("Invalid response, clearing cookies");
            destroyCookie(null, "authToken");
            destroyCookie(null, "user");
          }
        } else {
          debugAuth("Auth check failed, clearing cookies");
          destroyCookie(null, "authToken");
          destroyCookie(null, "user");
        }
      } catch (error) {
        debugAuth("Auth initialization error:", error);
        destroyCookie(null, "authToken");
        destroyCookie(null, "user");
      } finally {
        debugAuth("Auth initialization complete, setting loading to false");
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    debugAuth("Login attempt for:", email);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      debugAuth("Login response:", data);

      if (data.success) {
        // Store token and user in cookies
        setCookie(null, "authToken", data.token, {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        setCookie(null, "user", JSON.stringify(data.user), {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        // Update global state
        debugAuth("Login successful, setting user:", data.user);
        setUser(data.user);

        toast.success(`Welcome back, ${data.user.name}!`);
        return true;
      } else {
        debugAuth("Login failed:", data.message);
        toast.error(data.message || "Login failed");
        return false;
      }
    } catch (error) {
      debugAuth("Login error:", error);
      toast.error("Network error. Please try again.");
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    debugAuth("Register attempt for:", email);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      debugAuth("Register response:", data);

      if (data.success) {
        // Store token and user in cookies
        setCookie(null, "authToken", data.token, {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        setCookie(null, "user", JSON.stringify(data.user), {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        // Update global state
        debugAuth("Registration successful, setting user:", data.user);
        setUser(data.user);

        toast.success(`Welcome to our platform, ${data.user.name}!`);
        return true;
      } else {
        debugAuth("Registration failed:", data.message);
        toast.error(data.message || "Registration failed");
        return false;
      }
    } catch (error) {
      debugAuth("Registration error:", error);
      toast.error("Network error. Please try again.");
      return false;
    }
  };

  const logout = () => {
    debugAuth("Logout initiated");

    // Clear cookies
    destroyCookie(null, "authToken");
    destroyCookie(null, "user");

    // Clear global state
    debugAuth("Clearing user state");
    setUser(null);

    toast.success("Logged out successfully");

    // Redirect to login page
    router.push("/login");
  };

  // Debug current state
  useEffect(() => {
    debugAuth("Auth state changed:", { user: user?.name || "null", loading });
  }, [user, loading]);

  const value = {
    user,
    loading,
    setUser,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
