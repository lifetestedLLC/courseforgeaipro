import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import openai, { isOpenAIConfigured } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { topic, duration, style } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    if (!openai) {
      throw new Error("OpenAI client not initialized");
    }

    // Generate video script using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert video scriptwriter for educational content. Create engaging, clear, and well-paced scripts with scene descriptions, voiceover text, and visual cues."
        },
        {
          role: "user",
          content: `Create a video script for: "${topic}"

Duration: ${duration || '5 minutes'}
Style: ${style || 'Professional and engaging'}

Please provide:
1. Video title
2. Hook (opening 15 seconds)
3. Main content sections with:
   - Scene description
   - Voiceover text
   - Visual suggestions
   - Timing
4. Call to action (closing)

Format the response as JSON with this structure:
{
  "title": "Video Title",
  "estimatedDuration": "5 minutes",
  "hook": {
    "voiceover": "Opening text",
    "visuals": "Visual description",
    "duration": "15 seconds"
  },
  "sections": [
    {
      "title": "Section Title",
      "voiceover": "Voiceover text",
      "visuals": "Visual suggestions",
      "duration": "1 minute"
    }
  ],
  "callToAction": {
    "voiceover": "Closing text",
    "visuals": "Visual description"
  }
}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const videoData = JSON.parse(content);

    return NextResponse.json({
      success: true,
      video: videoData,
      tokens: completion.usage,
    });

  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to generate video script" },
      { status: 500 }
    );
  }
}
