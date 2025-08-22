"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Heart,
  Bookmark,
  Eye,
  User,
  Trash2,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { parseCookies } from "nookies";

interface Article {
  _id: string;
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  readTime: string;
  createdAt: string;
  image: string | null | undefined;
  authorName: string;
  authorEmail: string;
  author: string; // user ID of author
  views: number;
  likes: number;
  tags: string[];
}

export default function ArticleIdPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit mode state and fields
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/articles/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setArticle(data.article);
          setError(null);
        } else {
          setError(data.message || "Article not found");
        }
      } catch (err) {
        setError("Failed to fetch article");
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  useEffect(() => {
    if (article) {
      setEditTitle(article.title);
      setEditExcerpt(article.excerpt);
      setEditContent(article.content);
    }
  }, [article]);

  // Delete article
  const handleDeleteArticle = async () => {
    if (!article || !user) return;

    try {
      setIsDeleting(true);
      const cookies = parseCookies();
      const token = cookies.authToken;

      const response = await fetch(`/api/articles/${article.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Article deleted successfully");
        router.push("/");
      } else {
        toast.error(data.message || "Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  // Save edited article inline
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;

    try {
      setIsSaving(true);
      const cookies = parseCookies();
      const token = cookies.authToken;

      const response = await fetch(`/api/articles/${article.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          excerpt: editExcerpt,
          content: editContent,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Article updated successfully");
        setArticle(data.article);
        setIsEditing(false);
      } else {
        toast.error(data.message || "Failed to update article");
      }
    } catch (err) {
      toast.error("Network error while updating article");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getOptimizedImageUrl = (
    imageUrl: string | null | undefined,
    width = 800,
    height = 400
  ) => {
    if (!imageUrl || typeof imageUrl !== "string") {
      return "/placeholder.svg?height=400&width=800";
    }

    if (imageUrl.includes("cloudinary.com")) {
      const parts = imageUrl.split("/upload/");
      if (parts.length === 2) {
        return `${parts[0]}/upload/c_fill,w_${width},h_${height},q_auto,f_auto/${parts[1]}`;
      }
    }

    return imageUrl;
  };

  // Only show author controls if current user is the author
  const isAuthor = user && article && user.id === article.author;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {error || "Article saved"}
          </h1>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
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
              <div className="flex items-center justify-between">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  {article.category}
                </Badge>

                {isAuthor && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this article?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your article "{article.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteArticle}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {isDeleting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Deleting...
                              </>
                            ) : (
                              "Delete Article"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                {isEditing ? (
                  <form onSubmit={handleSaveArticle} className="space-y-5">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Title"
                      required
                    />
                    <textarea
                      value={editExcerpt}
                      onChange={(e) => setEditExcerpt(e.target.value)}
                      className="w-full p-2 border rounded"
                      rows={2}
                      placeholder="Excerpt"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 border rounded"
                      rows={12}
                      placeholder="Content"
                      required
                    />
                    <div className="flex gap-4">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  article.title
                )}
              </h1>

              {!isEditing && (
                <>
                  <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {article.authorName}
                        </p>
                        <p className="text-sm">{article.authorEmail}</p>
                      </div>
                    </div>
                    <Separator orientation="vertical" className="h-12" />
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(article.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {article.views || 0} views
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              )}
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
            <img
              src={
                getOptimizedImageUrl(article.image, 800, 400) ||
                "/placeholder.svg"
              }
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg?height=400&width=800";
              }}
            />
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
              {!isEditing && (
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                  <CardContent className="p-8">
                    {/* Excerpt */}
                    {article.excerpt && (
                      <div className="mb-8 p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                        <p className="text-lg text-slate-700 dark:text-slate-300 italic leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>
                    )}

                    {/* Article Content */}
                    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-a:text-blue-600 dark:prose-a:text-blue-400">
                      <div className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
                        {article.content}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
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
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Actions
                  </h3>
                  <div className="space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 bg-transparent"
                        onClick={() => setIsLiked(!isLiked)}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isLiked ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                        {isLiked ? "Liked" : "Like"} ({article.likes || 0})
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 bg-transparent"
                        onClick={() => setIsBookmarked(!isBookmarked)}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            isBookmarked ? "fill-blue-500 text-blue-500" : ""
                          }`}
                        />
                        {isBookmarked ? "Saved" : "Save"}
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 bg-transparent"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: article.title,
                              text: article.excerpt,
                              url: window.location.href,
                            });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                          }
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              {/* Article Stats */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                    Article Stats
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">
                        Views
                      </span>
                      <span className="font-medium">{article.views || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">
                        Likes
                      </span>
                      <span className="font-medium">{article.likes || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">
                        Read Time
                      </span>
                      <span className="font-medium">{article.readTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">
                        Category
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Author Info */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                    About the Author
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {article.authorName}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {article.authorEmail}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
