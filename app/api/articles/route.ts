import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Article, CreateArticleData } from "@/lib/models/Article"

// This is where you'll integrate with MongoDB
export async function POST(request: NextRequest) {
  try {
    const articleData: CreateArticleData = await request.json()

    // Validate required fields
    if (!articleData.title || !articleData.content || !articleData.excerpt || !articleData.category) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Connect to MongoDB
    const db = await getDatabase()
    const collection = db.collection<Article>("articles")

    // Prepare article data
    const article: Omit<Article, "_id"> = {
      title: articleData.title,
      content: articleData.content,
      excerpt: articleData.excerpt,
      category: articleData.category,
      tags: articleData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      image: articleData.image,
      author: articleData.author,
      authorName: articleData.authorName,
      authorEmail: articleData.authorEmail,
      published: true,
      readTime: Math.ceil(articleData.content.split(" ").length / 200) + " min read",
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0,
    }

    // Insert article into MongoDB
    const result = await collection.insertOne(article)

    if (result.acknowledged) {
      return NextResponse.json({
        success: true,
        id: result.insertedId.toString(),
        message: "Article created successfully",
      })
    } else {
      throw new Error("Failed to insert article")
    }
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ success: false, message: "Failed to create article" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    // Connect to MongoDB
    const db = await getDatabase()
    const collection = db.collection<Article>("articles")

    // Build query
    const query: any = { published: true }

    if (category && category !== "All") {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ]
    }

    // Get total count for pagination
    const totalArticles = await collection.countDocuments(query)

    // Get articles with pagination
    const articles = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Convert ObjectId to string for JSON serialization
    const serializedArticles = articles.map((article) => ({
      ...article,
      _id: article._id?.toString(),
      id: article._id?.toString(),
    }))

    return NextResponse.json({
      success: true,
      articles: serializedArticles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalArticles / limit),
        totalArticles,
        hasNextPage: page < Math.ceil(totalArticles / limit),
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch articles" }, { status: 500 })
  }
}
