import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    const users = await db.collection("users").find().toArray();
    return Response.json({ success: true, authors: users });
  } catch (error) {
    console.error("Error fetching authors:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
