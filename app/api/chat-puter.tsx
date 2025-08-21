import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { message, image } = await req.json()

    // This endpoint is not used in the current implementation
    // as we're using direct client-side calls to Puter AI
    return NextResponse.json(
      {
        error: "This endpoint is deprecated. Use client-side Puter AI integration instead.",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Puter API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
