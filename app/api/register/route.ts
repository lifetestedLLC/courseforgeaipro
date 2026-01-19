import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    logger.info("User registration attempt", { email, name });

    if (!email || !password || !name) {
      logger.warn("Registration failed: missing required fields", { email });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await createUser(email, password, name);

    logger.info("User registered successfully", { 
      userId: user.id, 
      email: user.email 
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name || 'there')
      .then(() => {
        logger.info("Welcome email sent", { email: user.email });
      })
      .catch((error) => {
        logger.error("Failed to send welcome email", error as Error, { 
          email: user.email 
        });
        // Don't fail registration if email fails
      });

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Registration error", error as Error, { 
      message: (error as Error).message 
    });
    
    return NextResponse.json(
      { error: (error as Error).message || "Something went wrong" },
      { status: 500 }
    );
  }
}
