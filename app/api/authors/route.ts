import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { User } from "@/lib/models/User";

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection<User>("users");

    // Fetch all users. You might want to filter by role: { role: "user" }
    const authors = await collection
      .find({}) // Fetch all users
      .project({ password: 0 }) // Exclude password from the result
      .toArray();

    // Convert ObjectId to string for JSON serialization
    const serializedAuthors = authors.map((author) => ({
      ...author,
      _id: author._id?.toString(),
      id: author._id?.toString(), // Add 'id' for consistency if needed on client
    }));

    return NextResponse.json({
      success: true,
      authors: serializedAuthors,
      message: "Authors fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}
