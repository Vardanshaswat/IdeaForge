"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast" // Import useToast

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  bio?: string
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user as AuthUser) // Cast to AuthUser
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })
      if (response.ok) {
        setUser(null)
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        toast({
          title: "Logged out successfully!",
          description: "You have been logged out of your account.",
          variant: "default",
        })
        router.push("/login")
      } else {
        console.error("Logout failed")
        toast({
          title: "Logout Failed",
          description: "There was an error logging you out. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Network Error",
        description: "Could not connect to the server. Please check your internet connection.",
        variant: "destructive",
      })
    }
  }

  return { user, loading, logout }
}
