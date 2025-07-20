import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  avatar?: string
  bio?: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
  emailVerified?: boolean
}

export interface CreateUserData {
  name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}
