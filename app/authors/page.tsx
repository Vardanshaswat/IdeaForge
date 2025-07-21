"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth"; // Import useAuth
import { Card, CardContent } from "@/components/ui/card"; // Import Card components

interface Author {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  likes?: number; // Add likes field
  likedBy?: string[]; // Add likedBy field
}

export default function AuthorsPage() {
  const { user, loading: authLoading } = useAuth(); // Get current user from useAuth
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleLike = async (authorId: string) => {
    if (!user) {
      alert("You need to be logged in to like an author.");
      return;
    }

    try {
      const response = await fetch(`/api/authors/${authorId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        // Update the local state to reflect the new like count and likedBy status
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
      } else {
        alert(data.message || "Failed to update like status.");
      }
    } catch (error) {
      console.error("Error liking author:", error);
      alert("Failed to like/unlike author. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
        Registered Authors
      </h1>
      {authors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-300">
            No authors found.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {authors.map((author) => {
            const isLikedByCurrentUser =
              user && author.likedBy?.includes(user.id);
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
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLike(author._id)}
                        disabled={!user} // Disable if not logged in
                        className={`flex items-center gap-1 ${
                          isLikedByCurrentUser
                            ? "text-red-500 border-red-500"
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
