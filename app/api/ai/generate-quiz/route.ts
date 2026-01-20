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
    const usageCheck = await checkUsageLimit(session.user.id, 'quizzes');
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
    const { topic, difficulty, questionCount } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const numQuestions = questionCount || 10;

    if (!openai) {
      throw new Error("OpenAI client not initialized");
    }

    // Generate quiz using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert quiz creator for educational content. Create well-crafted, challenging, and fair assessment questions with clear correct answers and plausible distractors."
        },
        {
          role: "user",
          content: `Create a quiz for: "${topic}"

Difficulty: ${difficulty || 'Intermediate'}
Number of questions: ${numQuestions}

Please provide:
1. Quiz title
2. ${numQuestions} multiple choice questions with:
   - Question text
   - 4 answer options (A, B, C, D)
   - Correct answer
   - Explanation for the correct answer

Include a mix of:
- Knowledge recall (30%)
- Comprehension (40%)
- Application (30%)

Format the response as JSON with this structure:
{
  "title": "Quiz Title",
  "difficulty": "Intermediate",
  "questions": [
    {
      "question": "Question text?",
      "options": {
        "A": "Option A",
        "B": "Option B",
        "C": "Option C",
        "D": "Option D"
      },
      "correctAnswer": "B",
      "explanation": "Explanation of why B is correct"
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
    const quizData = JSON.parse(content);

    // Increment usage counter after successful generation
    await incrementUsage(session.user.id, 'quizzes');

    return NextResponse.json({
      success: true,
      quiz: quizData,
      tokens: completion.usage,
    });

  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
