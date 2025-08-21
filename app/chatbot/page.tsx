"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Bot,
  Send,
  Sparkles,
  MessageSquare,
  Zap,
} from "lucide-react";

declare global {
  interface Window {
    puter?: {
      ai?: {
        chat: (message: string, options?: any) => Promise<any>;
      };
    };
  }
}

export default function TestPuterPage() {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testMessage, setTestMessage] = useState(
    "Help me write a compelling blog post introduction about artificial intelligence"
  );
  const [testResponse, setTestResponse] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPuterSDK = async () => {
      try {
        // Check if already loaded
        if (window.puter?.ai?.chat) {
          setSdkLoaded(true);
          setLoading(false);
          return;
        }

        // Create script element
        const script = document.createElement("script");
        script.src = "https://js.puter.com/v2/";
        script.async = true;

        script.onload = () => {
          // Wait a bit for puter to initialize
          setTimeout(() => {
            if (window.puter?.ai?.chat) {
              setSdkLoaded(true);
              console.log("Puter SDK loaded successfully");
            } else {
              console.error("Puter SDK loaded but AI chat not available");
              setError("Puter AI service not available");
            }
            setLoading(false);
          }, 1000);
        };

        script.onerror = () => {
          console.error("Failed to load Puter SDK");
          setError("Failed to load Puter SDK");
          setLoading(false);
        };

        document.head.appendChild(script);
      } catch (err) {
        console.error("Error loading Puter SDK:", err);
        setError("Error loading Puter SDK");
        setLoading(false);
      }
    };

    loadPuterSDK();
  }, []);

  const extractTextFromResponse = (response: any): string => {
    console.log("Puter AI Response:", response);

    // If it's already a string
    if (typeof response === "string") {
      return response;
    }

    // If it's an object, try different properties
    if (typeof response === "object" && response !== null) {
      // Try common text properties
      if (response.message && typeof response.message === "string") {
        return response.message;
      }
      if (response.content && typeof response.content === "string") {
        return response.content;
      }
      if (response.text && typeof response.text === "string") {
        return response.text;
      }
      if (response.response && typeof response.response === "string") {
        return response.response;
      }

      // If it has a toString method that's not the default Object toString
      if (
        response.toString &&
        typeof response.toString === "function" &&
        response.toString !== Object.prototype.toString
      ) {
        const stringResult = response.toString();
        if (stringResult !== "[object Object]") {
          return stringResult;
        }
      }

      // As a last resort, stringify the object
      try {
        return JSON.stringify(response, null, 2);
      } catch {
        return "Unable to parse response";
      }
    }

    // Fallback
    return String(response);
  };

  const testPuterAI = async () => {
    if (!window.puter?.ai?.chat) {
      setError("Puter AI not available");
      return;
    }

    setTestLoading(true);
    setTestResponse("");
    setError(null);

    try {
      const response = await window.puter.ai.chat(testMessage, {
        model: "gpt-5-nano",
      });

      const responseText = extractTextFromResponse(response);
      setTestResponse(responseText);
    } catch (err) {
      console.error("Test error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setTestLoading(false);
    }
  };

  const blogPrompts = [
    "Help me write a compelling blog post introduction about artificial intelligence",
    "Generate ideas for a tech blog post about web development trends",
    "Write a conclusion for a blog post about sustainable technology",
    "Create an engaging title for a blog post about remote work productivity",
    "Help me outline a blog post about the future of digital marketing",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Sparkles className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              AI-Powered Blog Assistant
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Enhance your blog writing with Puter AI. Get instant help with
              content creation, ideas, and optimization.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Assistant Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6" />
                  Blog Writing Assistant
                  {sdkLoaded && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <Zap className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Status Indicator */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                      <span className="text-slate-600 dark:text-slate-300">
                        Initializing AI Assistant...
                      </span>
                    </>
                  ) : sdkLoaded ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 dark:text-green-400 font-medium">
                        AI Assistant Ready
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-600 dark:text-red-400">
                        Assistant Unavailable
                      </span>
                    </>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </p>
                  </div>
                )}

                {/* Input Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      What would you like help with?
                    </label>
                    <Textarea
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      placeholder="Ask for blog ideas, writing help, content optimization..."
                      className="min-h-[120px] resize-none border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <Button
                    onClick={testPuterAI}
                    disabled={!sdkLoaded || testLoading || !testMessage.trim()}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3"
                    size="lg"
                  >
                    {testLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Generating Response...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Get AI Assistance
                      </>
                    )}
                  </Button>
                </div>

                {/* Response Section */}
                {testResponse && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      AI Response
                    </label>
                    <div className="p-6 bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="prose prose-slate dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                          {testResponse}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Prompts */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-600" />
                  Quick Prompts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {blogPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setTestMessage(prompt)}
                    className="w-full text-left p-3 text-sm bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 hover:border-indigo-300"
                  >
                    {prompt}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">AI Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        Content Generation
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Generate blog posts, titles, and ideas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        Instant Responses
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Get immediate AI-powered assistance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        Free to Use
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        No API keys or registration required
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integration Info */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <Bot className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Powered by Puter AI
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Advanced GPT-5 Nano model for intelligent blog assistance
                  </p>
                  <Badge
                    variant="outline"
                    className="bg-white/50 dark:bg-slate-800/50"
                  >
                    GPT-5 Nano
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
