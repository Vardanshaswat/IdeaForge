"use client";

import { useEffect, useState, useMemo } from "react";
import { Heart, UserPlus, UserMinus, Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Author {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  likes?: number;
  likedBy?: string[];
  followers?: string[];
}

export default function AuthorsPage() {
  const { user, loading: authLoading } = useAuth();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"all" | "followed">("all");
  const { toast } = useToast();
  const [isLiking, setIsLiking] = useState(false);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/authors");
      const data = await res.json();
      if (data.success) {
        setAuthors(data.authors);
      }
    } catch (err) {
      console.error("Failed to fetch authors:", err);
      toast({
        title: "Error",
        description: "Failed to load authors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const displayedAuthors = useMemo(() => {
    if (viewMode === "followed" && user) {
      return authors.filter((author) => author.followers?.includes(user.id));
    }
    return authors;
  }, [authors, viewMode, user]);

  const handleLike = async (authorId: string) => {
    if (isLiking) return; // Ignore if request already in progress

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to like an author.",
        variant: "destructive",
      });
      return;
    }

    setIsLiking(true);
    try {
      const response = await fetch(`/api/authors/${authorId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setAuthors((prevAuthors) =>
          prevAuthors.map((author) =>
            author._id === authorId
              ? {
                  ...author,
                  likes: data.likes,
                  likedBy: data.likedBy,
                }
              : author
          )
        );
        console.log("Updated authors state:", authors);
        toast({
          title: "Success",
          description: data.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update like status.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error liking author:", error);
      toast({
        title: "Network Error",
        description: "Failed to like/unlike author. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleFollow = async (authorId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to follow an author.",
        variant: "destructive",
      });
      return;
    }

    if (user.id === authorId) {
      toast({
        title: "Action Not Allowed",
        description: "You cannot follow yourself.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/authors/${authorId}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setAuthors((prevAuthors) =>
          prevAuthors.map((author) =>
            author._id === authorId
              ? {
                  ...author,
                  followers: data.userIsFollowing
                    ? [...(author.followers || []), user.id]
                    : (author.followers || []).filter((id) => id !== user.id),
                }
              : author
          )
        );
        toast({
          title: "Success",
          description: data.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update follow status.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error following author:", error);
      toast({
        title: "Network Error",
        description: "Failed to follow/unfollow author. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">
            Loading authors...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
        Registered Authors
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant={viewMode === "all" ? "default" : "outline"}
          onClick={() => setViewMode("all")}
          className="flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          All Authors
        </Button>
        {user && (
          <Button
            variant={viewMode === "followed" ? "default" : "outline"}
            onClick={() => setViewMode("followed")}
            className="flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            Authors You Follow
          </Button>
        )}
      </div>

      {displayedAuthors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-300">
            {viewMode === "followed" && user
              ? "You are not following any authors yet."
              : "No authors found."}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {displayedAuthors.map((author) => {
            const isLikedByCurrentUser =
              user && author.likedBy?.includes(user.id);
            console.log(
              `Author ${author.name}, likedBy:`,
              author.likedBy,
              "User liked:",
              isLikedByCurrentUser
            );
            const isFollowedByCurrentUser =
              user && author.followers?.includes(user.id);
            const isCurrentUserAuthor = user && user.id === author._id;

            return (
              <li key={author._id}>
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    {author.avatar ? (
                      <img
                        src={author.avatar || "/placeholder.svg"}
                        alt={author.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-400 dark:border-blue-600 shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-blue-200 dark:bg-blue-700 flex items-center justify-center text-blue-800 dark:text-blue-200 text-4xl font-bold">
                        {author.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-xl font-semibold text-slate-900 dark:text-white">
                        {author.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {author.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLike(author._id)}
                        disabled={!user}
                        className={`flex items-center gap-1 ${
                          isLikedByCurrentUser
                            ? "text-black-500 border-black-500"
                            : "text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isLikedByCurrentUser ? "fill-red-500" : ""
                          }`}
                        />
                        {author.likes || 0}
                      </Button>
                      <Button
                        variant={
                          isFollowedByCurrentUser ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleFollow(author._id)}
                        disabled={!user || !!isCurrentUserAuthor}
                        className={`flex items-center gap-1 ${
                          isFollowedByCurrentUser
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        {isFollowedByCurrentUser ? (
                          <UserMinus className="w-4 h-4" />
                        ) : (
                          <UserPlus className="w-4 h-4" />
                        )}
                        {isFollowedByCurrentUser ? "Following" : "Follow"} (
                        {author.followers?.length || 0})
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
