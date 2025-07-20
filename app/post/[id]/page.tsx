"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, Share2, Heart, Bookmark, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useState } from "react"

// Mock post data - in a real app, this would come from your CMS or API
const getPostById = (id: string) => {
  const posts = {
    "1": {
      id: 1,
      title: "The Future of Web Design: Trends That Will Shape 2024",
      content: `
        <p>The web design landscape is constantly evolving, and 2024 promises to bring some of the most exciting changes we've seen in years. From AI-powered design tools to immersive 3D experiences, the future of web design is both thrilling and transformative.</p>

        <h2>1. AI-Driven Design Systems</h2>
        <p>Artificial intelligence is revolutionizing how we approach design systems. Modern AI tools can now generate consistent design tokens, suggest optimal color palettes, and even create entire component libraries based on brand guidelines.</p>

        <h2>2. Immersive 3D Experiences</h2>
        <p>WebGL and WebXR technologies are making it easier than ever to create stunning 3D experiences directly in the browser. From product showcases to interactive storytelling, 3D elements are becoming a standard part of modern web design.</p>

        <h2>3. Micro-Interactions and Animation</h2>
        <p>Subtle animations and micro-interactions are no longer just nice-to-have features—they're essential for creating engaging user experiences. Tools like Framer Motion and Lottie are making it easier for developers to implement smooth, performant animations.</p>

        <h2>4. Sustainable Design Practices</h2>
        <p>As environmental consciousness grows, web designers are focusing on creating more sustainable websites. This includes optimizing for performance, reducing energy consumption, and designing with accessibility in mind.</p>

        <h2>Conclusion</h2>
        <p>The future of web design is bright, with new technologies and methodologies emerging constantly. By staying informed about these trends and experimenting with new tools, designers can create more engaging, accessible, and sustainable web experiences.</p>
      `,
      category: "Design",
      readTime: "8 min read",
      date: "Dec 15, 2023",
      image: "/placeholder.svg?height=400&width=800",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        bio: "Senior UX Designer with 8+ years of experience in creating digital experiences.",
      },
      stats: {
        views: "2.4k",
        likes: 156,
        bookmarks: 89,
      },
    },
  }
  return posts[id] || null
}

export default function PostPage({ params }: { params: { id: string } }) {
  const post = getPostById(params.id)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Post not found</h1>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative max-w-4xl mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Link href="/">
              <motion.div
                whileHover={{ x: -5 }}
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </motion.div>
            </Link>

            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">{post.category}</Badge>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{post.author.name}</p>
                    <p className="text-sm">{post.author.bio}</p>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.stats.views} views
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative overflow-hidden rounded-2xl shadow-2xl"
          >
            <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="lg:col-span-3"
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                <CardContent className="p-8">
                  <div
                    className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-a:text-blue-600 dark:prose-a:text-blue-400"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Actions */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 sticky top-4">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Actions</h3>
                  <div className="space-y-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 bg-transparent"
                        onClick={() => setIsLiked(!isLiked)}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                        {isLiked ? "Liked" : "Like"} ({post.stats.likes})
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 bg-transparent"
                        onClick={() => setIsBookmarked(!isBookmarked)}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-blue-500 text-blue-500" : ""}`} />
                        {isBookmarked ? "Saved" : "Save"} ({post.stats.bookmarks})
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                        <Share2 className="w-4 h-4" />
                        Share
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
