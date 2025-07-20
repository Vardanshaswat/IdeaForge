import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Article } from "@/lib/models/Article"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid article ID" }, { status: 400 })
    }

    // Connect to MongoDB
    const db = await getDatabase()
    const collection = db.collection<Article>("articles")

    // Find article by ID
    const article = await collection.findOne({ _id: new ObjectId(id) })

    if (!article) {
      return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 })
    }

    // Increment view count
    await collection.updateOne({ _id: new ObjectId(id) }, { $inc: { views: 1 } })

    // Convert ObjectId to string for JSON serialization
    const serializedArticle = {
      ...article,
      _id: article._id?.toString(),
      id: article._id?.toString(),
    }

    return NextResponse.json({
      success: true,
      article: serializedArticle,
    })
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch article" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const updateData = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid article ID" }, { status: 400 })
    }

    // Connect to MongoDB
    const db = await getDatabase()
    const collection = db.collection<Article>("articles")

    // Update article
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Article updated successfully",
    })
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ success: false, message: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid article ID" }, { status: 400 })
    }

    // Connect to MongoDB
    const db = await getDatabase()
    const collection = db.collection<Article>("articles")

    // Delete article
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ success: false, message: "Failed to delete article" }, { status: 500 })
  }
}
