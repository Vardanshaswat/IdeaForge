import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getDatabase } from "@/lib/mongodb"
import type { User } from "@/lib/models/User"

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "supersecret123456789012345678901234567890"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
  } catch {
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase()
  const collection = db.collection<User>("users")
  return collection.findOne({ email })
}

export async function createUser(userData: { name: string; email: string; password: string }): Promise<User> {
  const db = await getDatabase()
  const collection = db.collection<User>("users")

  const hashedPassword = await hashPassword(userData.password)

  const user: Omit<User, "_id"> = {
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerified: false,
  }

  const result = await collection.insertOne(user)
  return { ...user, _id: result.insertedId }
}
