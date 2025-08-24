import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { Article } from "@/lib/models/Article";
import { verifyToken } from "@/lib/auth";
import { parseCookies } from "nookies";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid article ID" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const db = await getDatabase();
    const collection = db.collection<Article>("articles");

    // Find article by ID
    const article = await collection.findOne({ _id: new ObjectId(id) });

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    );

    console.log(
      "hereeeeeeeeeeeeeeeee",
      `Incrementing likes for article with ID: ${id}`
    );

    // await collection.updateOne(
    //   { _id: new ObjectId(id) },
    //   { $inc: { likes: 1 } }
    // );

    {
      /* hereeeeeeeeeeee111 */
    }

    // await collection.updateOne(
    //   { _id: new ObjectId(id) },
    //   { $inc: { likes: 1 } }
    // );

    // Convert ObjectId to string for JSON serialization
    const serializedArticle = {
      ...article,
      _id: article._id?.toString(),
      id: article._id?.toString(),
    };

    return NextResponse.json({
      success: true,
      article: serializedArticle,
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updateData = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid article ID" },
        { status: 400 }
      );
    }

    // Get auth token from cookie or Authorization header
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = parseCookies({
      req: { headers: { cookie: cookieHeader } },
    } as any);
    const token =
      cookies["authToken"] ||
      request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token using our auth utility
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // Connect to MongoDB
    const db = await getDatabase();
    const collection = db.collection<Article>("articles");

    // Check if article exists and user owns it
    const article = await collection.findOne({ _id: new ObjectId(id) });
    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    if (article.author !== userId) {
      return NextResponse.json(
        { success: false, message: "You can only edit your own articles" },
        { status: 403 }
      );
    }

    // Update article
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Article updated successfully",
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid article ID" },
        { status: 400 }
      );
    }

    // SECURITY CHECK 1: Get auth token from cookie or Authorization header
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = parseCookies({
      req: { headers: { cookie: cookieHeader } },
    } as any);
    const token =
      cookies["authToken"] ||
      request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // SECURITY CHECK 2: Verify token using JWT_SECRET
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // Connect to MongoDB
    const db = await getDatabase();
    const collection = db.collection<Article>("articles");

    // SECURITY CHECK 3: Check if article exists and user owns it
    const article = await collection.findOne({ _id: new ObjectId(id) });
    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    // SECURITY CHECK 4: Verify ownership - only author can delete
    if (article.author !== userId) {
      return NextResponse.json(
        { success: false, message: "You can only delete your own articles" },
        { status: 403 }
      );
    }

    // Delete article from database
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete article" },
      { status: 500 }
    );
  }
}
