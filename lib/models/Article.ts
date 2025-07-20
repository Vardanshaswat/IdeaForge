import type { ObjectId } from "mongodb"

export interface Article {
  _id?: ObjectId
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  image: string
  author: string
  authorName: string
  authorEmail: string
  published: boolean
  readTime: string
  createdAt: Date
  updatedAt: Date
  views?: number
  likes?: number
}

export interface CreateArticleData {
  title: string
  content: string
  excerpt: string
  category: string
  tags: string
  image: string
  author: string
  authorName: string
  authorEmail: string
}
