import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { User } from "@/lib/models/User";
import { verifyToken } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: authorId } = params;
    

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

    if (!ObjectId.isValid(authorId)) {
      return NextResponse.json(
        { success: false, message: "Invalid author ID" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<User>("users");

    const author = await collection.findOne({ _id: new ObjectId(authorId) });

    if (!author) {
      return NextResponse.json(
        { success: false, message: "Author not found" },
        { status: 404 }
      );
    }

    let newLikes = author.likes || 0;
    let newLikedBy = author.likedBy || [];
    let message = "";

    const userHasLiked = newLikedBy.includes(currentUserId);

    if (userHasLiked) {
      // User has already liked, so unlike
      newLikes = Math.max(0, newLikes - 1); // Ensure likes don't go below zero
      newLikedBy = newLikedBy.filter((userId) => userId !== currentUserId);
      message = "Author unliked successfully";
    } else {
      // User has not liked, so like
      newLikes += 1;
      newLikedBy.push(currentUserId);
      message = "Author liked successfully";
    }

    await collection.updateOne(
      { _id: new ObjectId(authorId) },
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
    console.error("Error liking/unliking author:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update like status" },
      { status: 500 }
    );
  }
}
