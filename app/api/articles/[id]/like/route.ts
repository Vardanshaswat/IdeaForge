import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyToken } from "@/lib/auth";
import type { Article } from "@/lib/models/Article"; // Adjust path accordingly

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: articleId } = params;

    // Get token from cookie or Authorization header
    const token =
      request.cookies.get("auth-token")?.value ||
      request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const currentUserId = decoded.userId;

    if (!ObjectId.isValid(articleId)) {
      return NextResponse.json(
        { success: false, message: "Invalid article ID" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<Article>("articles");

    const article = await collection.findOne({ _id: new ObjectId(articleId) });

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    let newLikes = article.likes || 0;
    let newLikedBy = article.likedBy || [];
    let message = "";

    const userHasLiked = newLikedBy.includes(currentUserId);

    if (userHasLiked) {
      // User has already liked, so unlike
      newLikes = Math.max(0, newLikes - 1); // Prevent negative likes
      newLikedBy = newLikedBy.filter((userId) => userId !== currentUserId);
      message = "Article unliked successfully";
    } else {
      // User has not liked, so like
      newLikes += 1;
      newLikedBy.push(currentUserId);
      message = "Article liked successfully";
    }

    await collection.updateOne(
      { _id: new ObjectId(articleId) },
      {
        $set: {
          likes: newLikes,
          likedBy: newLikedBy,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message,
      likes: newLikes,
      likedBy: newLikedBy,
    });
  } catch (error) {
    console.error("Error liking/unliking article:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update like status" },
      { status: 500 }
    );
  }
}
