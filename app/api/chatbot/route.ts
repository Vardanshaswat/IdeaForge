import { type NextRequest, NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { messages, model = "gpt-5-nano", image } = await req.json();

    // Validate that we have messages
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, message: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      return NextResponse.json(
        { success: false, message: "No user message found" },
        { status: 400 }
      );
    }

    // Create the HTML content that will run Puter AI
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <script src="https://js.puter.com/v2/"></script>
      </head>
      <body>
        <script>
          async function runPuterAI() {
            try {
              const response = await puter.ai.chat(
                "${lastMessage.content.replace(/"/g, '\\"')}",
                ${image ? `"${image}"` : "null"},
                { model: "${model}" }
              );
              
              // Send response back to parent
              if (window.parent) {
                window.parent.postMessage({
                  type: 'puter-response',
                  data: response
                }, '*');
              }
            } catch (error) {
              if (window.parent) {
                window.parent.postMessage({
                  type: 'puter-error',
                  error: error.message
                }, '*');
              }
            }
          }
          
          runPuterAI();
        </script>
      </body>
      </html>
    `;

    // Return the HTML content that will be used in an iframe
    return new Response(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error in Puter chat route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process chat request.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Add a GET method for testing
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Puter AI chat API route is accessible",
    timestamp: new Date().toISOString(),
    requiresApiKey: false,
    supportedModels: ["gpt-5-nano"],
    features: ["text-chat", "image-analysis"],
  });
}
