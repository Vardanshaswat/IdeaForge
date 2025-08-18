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

    // Prevent a user from following themselves
    if (currentUserId === authorId) {
      return NextResponse.json(
        { success: false, message: "You cannot follow yourself." },
        { status: 400 }
      );
    }

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

    let newFollowers = author.followers || [];
    let message = "";

    const userIsFollowing = newFollowers.includes(currentUserId);

    if (userIsFollowing) {
      // User is already following, so unfollow
      newFollowers = newFollowers.filter((userId: string) => userId !== currentUserId);
      message = "Author unfollowed successfully";
    } else {
      // User is not following, so follow
      newFollowers.push(currentUserId);
      message = "Author followed successfully";
    }

    await collection.updateOne(
      { _id: new ObjectId(authorId) },
      {
        $set: {
          followers: newFollowers,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message,
      followersCount: newFollowers.length,
      userIsFollowing: !userIsFollowing, // Return the new status
    });
  } catch (error) {
    console.error("Error following/unfollowing author:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update follow status" },
      { status: 500 }
    );
  }
}
