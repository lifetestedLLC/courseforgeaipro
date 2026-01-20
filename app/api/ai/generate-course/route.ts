import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import openai, { isOpenAIConfigured } from "@/lib/openai";
import { checkUsageLimit, incrementUsage } from "@/lib/usage";

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

    // Check usage limits (admins have unlimited access)
    const usageCheck = await checkUsageLimit(session.user.id, 'courses');
    if (!usageCheck.allowed) {
      return NextResponse.json(
        { 
          error: usageCheck.message || "Usage limit exceeded",
          limit: usageCheck.limit,
          current: usageCheck.current,
        },
        { status: 403 }
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
    const { topic, level, duration } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    if (!openai) {
      throw new Error("OpenAI client not initialized");
    }

    // Generate course outline using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert course creator. Generate comprehensive, well-structured course outlines with modules, lessons, and learning objectives."
        },
        {
          role: "user",
          content: `Create a detailed course outline for: "${topic}"
          
Level: ${level || 'Intermediate'}
Estimated Duration: ${duration || '4 weeks'}

Please provide:
1. Course title and description
2. Target audience
3. Learning objectives (5-7 key objectives)
4. Course modules (4-6 modules)
5. For each module:
   - Module title
   - Module description
   - Lessons (3-5 lessons per module)
   - Key takeaways

Format the response as JSON with this structure:
{
  "title": "Course Title",
  "description": "Course description",
  "targetAudience": "Who this course is for",
  "learningObjectives": ["objective 1", "objective 2", ...],
  "modules": [
    {
      "title": "Module Title",
      "description": "Module description",
      "lessons": [
        {
          "title": "Lesson Title",
          "description": "Lesson description",
          "duration": "15 minutes"
        }
      ],
      "keyTakeaways": ["takeaway 1", "takeaway 2"]
    }
  ]
}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const courseData = JSON.parse(content);

    // Increment usage counter after successful generation
    await incrementUsage(session.user.id, 'courses');

    return NextResponse.json({
      success: true,
      course: courseData,
      tokens: completion.usage,
    });

  } catch (error) {
    console.error("Course generation error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to generate course" },
      { status: 500 }
    );
  }
}
