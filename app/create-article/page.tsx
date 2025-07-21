"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Lightbulb,
  ImageIcon,
  Type,
  Target,
  Save,
  Eye,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LogoutButton from "@/components/logoutButton";

// Authentication hook
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading };
};

const CreateArticlePage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: "",
    excerpt: "",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/create-article");
    }
  }, [user, loading, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const articleData = {
        ...formData,
        author: user?.id,
        authorName: user?.name,
        authorEmail: user?.email,
      };

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Article created:", result);
        router.push("/");
      } else {
        throw new Error("Failed to create article");
      }
    } catch (error) {
      console.error("Error creating article:", error);
      alert("Failed to create article. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tips = [
    {
      icon: Type,
      title: "Compelling Headlines",
      description:
        "Use attention-grabbing headlines that make readers want to click and read more",
    },
    {
      icon: ImageIcon,
      title: "High-Quality Images",
      description:
        "Include stunning visuals that complement and enhance your storytelling",
    },
    {
      icon: Lightbulb,
      title: "Clear Structure",
      description:
        "Break up text with subheadings and bullet points for better readability",
    },
    {
      icon: Target,
      title: "Call-to-Action",
      description:
        "End with a clear next step or question to engage your readers",
    },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login required message if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-8 text-center">
            <Lock className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              You need to be logged in to create articles.
            </p>
            <div className="space-y-3">
              <Link href="/login?redirect=/create-article">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Login
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Back Button */}
            <Link href="/">
              <motion.div
                whileHover={{ x: -5 }}
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </motion.div>
            </Link>

            <div className="flex items-center justify-between">
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Create Your Story
                  </span>
                </motion.div>

                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent leading-tight">
                  Write & Publish
                  <br />
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                  >
                    Your Article
                  </motion.span>
                </h1>
              </div>

              {/* User Info */}
              <div className="hidden md:flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
                <img
                  src={user.avatar || "/placeholder.svg?height=40&width=40"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Author
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Form Container */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="lg:col-span-3"
            >
              <Card className="overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Create New Article
                          </h2>
                          <p className="text-slate-600 dark:text-slate-300">
                            Share your knowledge with the world
                          </p>
                        </div>
                      </div>
                      <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPreviewMode(!previewMode)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      {previewMode ? "Edit" : "Preview"}
                    </Button>
                  </div>

                  {!previewMode ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                      >
                        <label
                          htmlFor="title"
                          className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white"
                        >
                          <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          Title *
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Enter an engaging article title..."
                          required
                          className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        />
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-2"
                        >
                          <label
                            htmlFor="category"
                            className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white"
                          >
                            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            Category *
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-slate-900 dark:text-white"
                          >
                            <option value="">Select a category</option>
                            <option value="Design">Design</option>
                            <option value="Development">Development</option>
                            <option value="AI">AI</option>
                            <option value="Productivity">Productivity</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Technology">Technology</option>
                            <option value="Business">Business</option>
                          </select>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-2"
                        >
                          <label
                            htmlFor="tags"
                            className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white"
                          >
                            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            Tags
                          </label>
                          <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="react, javascript, web development (comma separated)"
                            className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                          />
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                      >
                        <label
                          htmlFor="image"
                          className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white"
                        >
                          <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          Featured Image URL *
                        </label>
                        <input
                          type="url"
                          id="image"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          placeholder="https://example.com/your-image.jpg"
                          required
                          className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-2"
                      >
                        <label
                          htmlFor="excerpt"
                          className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white"
                        >
                          <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          Excerpt *
                        </label>
                        <textarea
                          id="excerpt"
                          name="excerpt"
                          value={formData.excerpt}
                          onChange={handleInputChange}
                          placeholder="Write a brief summary of your article..."
                          rows={3}
                          required
                          className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 resize-vertical"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-2"
                      >
                        <label
                          htmlFor="content"
                          className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white"
                        >
                          <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          Content *
                        </label>
                        <textarea
                          id="content"
                          name="content"
                          value={formData.content}
                          onChange={handleInputChange}
                          placeholder="Write your article content here... Share your thoughts, insights, and stories that will inspire your readers."
                          rows={12}
                          required
                          className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 resize-vertical"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="pt-4"
                      >
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <motion.div
                            className="flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Publishing Article...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Publish Article
                              </>
                            )}
                          </motion.div>
                        </Button>
                      </motion.div>
                    </form>
                  ) : (
                    // Preview Mode
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                          {formData.category || "Uncategorized"}
                        </Badge>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                          {formData.title || "Article Title"}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300">
                          {formData.excerpt ||
                            "Article excerpt will appear here..."}
                        </p>
                        {formData.tags && (
                          <div className="flex flex-wrap gap-2">
                            {formData.tags.split(",").map((tag, index) => (
                              <Badge key={index} variant="outline">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      {formData.image && (
                        <img
                          src={formData.image || "/placeholder.svg"}
                          alt="Featured"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      )}
                      <div className="prose prose-lg dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap">
                          {formData.content ||
                            "Article content will appear here..."}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <header className="flex justify-between items-center p-4 shadow">
              <h1 className="text-xl font-bold">Dashboard</h1>
              <LogoutButton />
            </header>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Tips Section */}
              <Card className="bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-900/50 border-slate-200/50 dark:border-slate-700/50 shadow-lg sticky top-4">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Writing Tips
                  </h3>
                  <div className="space-y-4">
                    {tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <tip.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-1">
                            {tip.title}
                          </h4>
                          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                            {tip.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreateArticlePage;
