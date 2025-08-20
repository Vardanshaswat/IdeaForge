import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import type { Article } from "@/lib/models/Article";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const { id } = params;

  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid article ID" },
      { status: 400 }
    );
  }

  try {
    const db = await getDatabase();
    const collection = db.collection<Article>("articles");

    const article = await collection.findOne({ _id: new ObjectId(id) });

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    // Serialize ObjectId to string
    const serializedArticle = {
      ...article,
      _id: article._id.toString(),
      id: article._id.toString(),
    };

    return NextResponse.json({ success: true, article: serializedArticle });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch article" },
      { status: 500 }
    );
  }
}
