"use client";

import { useEffect, useState } from "react";

interface Author {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
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

    fetchAuthors();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Registered Authors</h1>
      {loading ? (
        <p>Loading...</p>
      ) : authors.length === 0 ? (
        <p>No authors found.</p>
      ) : (
        <ul className="space-y-4">
          {authors.map((author) => (
            <li
              key={author._id}
              className="p-4 bg-gray-100 dark:bg-slate-800 rounded-md"
            >
              <div className="flex items-center gap-4">
                {author.avatar && (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold">{author.name}</p>
                  <p className="text-sm text-gray-500">{author.email}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
