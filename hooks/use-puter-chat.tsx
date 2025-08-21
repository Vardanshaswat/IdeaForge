"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  image?: string
}

interface UsePuterChatOptions {
  model?: string
  onError?: (error: Error) => void
  onFinish?: (message: Message) => void
}

interface UsePuterChatReturn {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent, image?: string) => void
  isLoading: boolean
  error: Error | null
  clearMessages: () => void
  stop: () => void
  puterLoaded: boolean
}

declare global {
  interface Window {
    puter?: {
      ai?: {
        chat: (message: string, options?: any) => Promise<any>
      }
    }
  }
}

export function usePuterChat(options: UsePuterChatOptions = {}): UsePuterChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [puterLoaded, setPuterLoaded] = useState(false)

  // Load Puter SDK
  useEffect(() => {
    const loadPuterSDK = async () => {
      try {
        // Check if already loaded
        if (window.puter?.ai?.chat) {
          setPuterLoaded(true)
          return
        }

        // Create script element
        const script = document.createElement("script")
        script.src = "https://js.puter.com/v2/"
        script.async = true

        script.onload = () => {
          // Wait a bit for puter to initialize
          setTimeout(() => {
            if (window.puter?.ai?.chat) {
              setPuterLoaded(true)
              console.log("Puter SDK loaded successfully")
            } else {
              console.error("Puter SDK loaded but AI chat not available")
              setError(new Error("Puter AI service not available"))
            }
          }, 1000)
        }

        script.onerror = () => {
          console.error("Failed to load Puter SDK")
          setError(new Error("Failed to load Puter SDK"))
        }

        document.head.appendChild(script)
      } catch (err) {
        console.error("Error loading Puter SDK:", err)
        setError(err instanceof Error ? err : new Error("Unknown error loading SDK"))
      }
    }

    loadPuterSDK()
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }, [])

  const extractTextFromResponse = (response: any): string => {
    console.log("Puter AI Response:", response)

    // If it's already a string
    if (typeof response === "string") {
      return response
    }

    // If it's an object, try different properties
    if (typeof response === "object" && response !== null) {
      // Try common text properties
      if (response.message && typeof response.message === "string") {
        return response.message
      }
      if (response.content && typeof response.content === "string") {
        return response.content
      }
      if (response.text && typeof response.text === "string") {
        return response.text
      }
      if (response.response && typeof response.response === "string") {
        return response.response
      }

      // If it has a toString method that's not the default Object toString
      if (
        response.toString &&
        typeof response.toString === "function" &&
        response.toString !== Object.prototype.toString
      ) {
        const stringResult = response.toString()
        if (stringResult !== "[object Object]") {
          return stringResult
        }
      }

      // As a last resort, stringify the object
      try {
        return JSON.stringify(response, null, 2)
      } catch {
        return "Unable to parse response"
      }
    }

    // Fallback
    return String(response)
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent, image?: string) => {
      e.preventDefault()

      if (!input.trim() || isLoading || !puterLoaded) return

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input.trim(),
        image,
      }

      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsLoading(true)
      setError(null)

      try {
        if (!window.puter?.ai?.chat) {
          throw new Error("Puter AI not available")
        }

        let prompt = input.trim()
        if (image) {
          prompt = `[Image uploaded] ${prompt}`
        }

        const response = await window.puter.ai.chat(prompt, {
          model: options.model || "gpt-5-nano",
        })

        const responseText = extractTextFromResponse(response)

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: responseText,
        }

        setMessages((prev) => [...prev, assistantMessage])

        if (options.onFinish) {
          options.onFinish(assistantMessage)
        }
      } catch (err) {
        console.error("Puter AI Error:", err)
        const error = err instanceof Error ? err : new Error("Unknown error occurred")
        setError(error)

        if (options.onError) {
          options.onError(error)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [input, isLoading, puterLoaded, options],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const stop = useCallback(() => {
    setIsLoading(false)
  }, [])

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    clearMessages,
    stop,
    puterLoaded,
  }
}
