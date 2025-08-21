"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle, XCircle, Bot, Send } from "lucide-react"

declare global {
  interface Window {
    puter?: {
      ai?: {
        chat: (message: string, options?: any) => Promise<any>
      }
    }
  }
}

export default function TestPuterPage() {
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [testMessage, setTestMessage] = useState("Hello! Can you help me with a simple coding question?")
  const [testResponse, setTestResponse] = useState("")
  const [testLoading, setTestLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPuterSDK = async () => {
      try {
        // Check if already loaded
        if (window.puter?.ai?.chat) {
          setSdkLoaded(true)
          setLoading(false)
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
              setSdkLoaded(true)
              console.log("Puter SDK loaded successfully")
            } else {
              console.error("Puter SDK loaded but AI chat not available")
              setError("Puter AI service not available")
            }
            setLoading(false)
          }, 1000)
        }

        script.onerror = () => {
          console.error("Failed to load Puter SDK")
          setError("Failed to load Puter SDK")
          setLoading(false)
        }

        document.head.appendChild(script)
      } catch (err) {
        console.error("Error loading Puter SDK:", err)
        setError("Error loading Puter SDK")
        setLoading(false)
      }
    }

    loadPuterSDK()
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

  const testPuterAI = async () => {
    if (!window.puter?.ai?.chat) {
      setError("Puter AI not available")
      return
    }

    setTestLoading(true)
    setTestResponse("")
    setError(null)

    try {
      const response = await window.puter.ai.chat(testMessage, {
        model: "gpt-5-nano",
      })

      const responseText = extractTextFromResponse(response)
      setTestResponse(responseText)
    } catch (err) {
      console.error("Test error:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setTestLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Puter AI Integration Test</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Testing the Puter AI SDK integration and response handling
          </p>
        </div>

        <div className="grid gap-6">
          {/* SDK Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Puter SDK Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span>Loading Puter SDK...</span>
                  </>
                ) : sdkLoaded ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600">SDK Loaded Successfully</span>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                      Ready
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-600">SDK Failed to Load</span>
                    <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20">
                      Error
                    </Badge>
                  </>
                )}
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Interface */}
          <Card>
            <CardHeader>
              <CardTitle>Test AI Chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Test Message
                </label>
                <Textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Enter a message to test..."
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={testPuterAI}
                disabled={!sdkLoaded || testLoading || !testMessage.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              >
                {testLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Test Puter AI
                  </>
                )}
              </Button>

              {testResponse && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    AI Response
                  </label>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-sm text-slate-900 dark:text-white">{testResponse}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Debug Info */}
          <Card>
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">SDK Available:</span>
                  <Badge variant={sdkLoaded ? "default" : "destructive"}>{sdkLoaded ? "Yes" : "No"}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Window.puter:</span>
                  <Badge variant={typeof window !== "undefined" && window.puter ? "default" : "destructive"}>
                    {typeof window !== "undefined" && window.puter ? "Available" : "Not Available"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">AI Chat Function:</span>
                  <Badge variant={typeof window !== "undefined" && window.puter?.ai?.chat ? "default" : "destructive"}>
                    {typeof window !== "undefined" && window.puter?.ai?.chat ? "Available" : "Not Available"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
