import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "20");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({
        success: true,
        images: [
          {
            public_id: "sample_image_1",
            secure_url: `https://res.cloudinary.com/${
              cloudName || "demo"
            }/image/upload/v1640000000/sample.jpg`,
            width: 800,
            height: 600,
            format: "jpg",
            created_at: new Date().toISOString(),
          },
          {
            public_id: "sample_image_2",
            secure_url: `https://res.cloudinary.com/${
              cloudName || "demo"
            }/image/upload/v1640000001/sample2.jpg`,
            width: 800,
            height: 600,
            format: "jpg",
            created_at: new Date().toISOString(),
          },
        ],
        next_cursor: null,
        total_count: 2,
      });
    }

    // Create basic auth header
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    // Fetch images using Cloudinary REST API
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?max_results=${limit}&sort_by[]=created_at&sort_by[]=desc`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Cloudinary API error: ${response.status} - ${errorText}`
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      images: result.resources || [],
      next_cursor: result.next_cursor,
      total_count: result.total_count || 0,
    });
  } catch (error) {
    console.error("[v0] Error fetching images from Cloudinary:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch images",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
