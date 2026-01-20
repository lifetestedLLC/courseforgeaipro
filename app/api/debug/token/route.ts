import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { logger } from "@/lib/logger";

/**
 * Debug endpoint to inspect server-side NextAuth JWT token.
 * This route is gated by DEBUG_TOKEN_ROUTE environment variable.
 * 
 * SECURITY: Only enable in production temporarily for debugging.
 * Set DEBUG_TOKEN_ROUTE=1 in Vercel environment variables to enable.
 * 
 * Usage: GET /api/debug/token
 * Returns: JWT token with role, roleLastFetched, and other claims
 */
export async function GET(request: NextRequest) {
  // Gate this endpoint with an environment variable
  if (process.env.DEBUG_TOKEN_ROUTE !== '1') {
    logger.warn("Debug token endpoint accessed but not enabled", {
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });
    return NextResponse.json(
      { error: "Not found" },
      { status: 403 }
    );
  }

  try {
    // Get the JWT token from the request
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      logger.info("Debug token endpoint: No token found");
      return NextResponse.json(
        { error: "No token found", message: "User is not authenticated" },
        { status: 401 }
      );
    }

    // Return the token (excluding sensitive fields if any)
    const { ...tokenData } = token;
    
    logger.info("Debug token endpoint accessed", {
      userId: token.sub || token.id,
      role: token.role,
      roleLastFetched: token.roleLastFetched
    });

    return NextResponse.json({
      success: true,
      token: tokenData,
      explanation: {
        role: "Current role from JWT",
        roleLastFetched: "Timestamp when role was last fetched from database (ms since epoch)",
        sub: "User ID",
        iat: "Token issued at (seconds since epoch)",
        exp: "Token expires at (seconds since epoch)",
        jti: "JWT ID (unique identifier)"
      }
    });
  } catch (error) {
    logger.error("Error in debug token endpoint", error as Error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
