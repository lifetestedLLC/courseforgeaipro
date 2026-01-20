import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { logger } from "@/lib/logger";

/**
 * Debug endpoint to view JWT token claims for authenticated users.
 * 
 * This endpoint is ONLY available when DEBUG_TOKEN_ROUTE environment variable is set to "1".
 * It returns the server-side NextAuth JWT token including role and roleLastFetched claims.
 * 
 * SECURITY: This endpoint is for temporary debugging only. Remove after verification.
 * Never expose tokens in production without this environment variable gate.
 * 
 * Usage:
 * 1. Set DEBUG_TOKEN_ROUTE=1 in Vercel environment variables
 * 2. Redeploy the application
 * 3. As an authenticated admin, visit /api/debug/token
 * 4. Verify JSON contains "role":"admin" and recent roleLastFetched timestamp
 */
export async function GET(request: NextRequest) {
  // Gate the endpoint with environment variable
  if (process.env.DEBUG_TOKEN_ROUTE !== "1") {
    logger.warn("Debug token endpoint accessed but DEBUG_TOKEN_ROUTE not enabled");
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  try {
    // Get the JWT token from the request
    const token = await getToken({ 
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      logger.warn("Debug token endpoint: No token found");
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Log access for security monitoring
    logger.info("Debug token endpoint accessed", { 
      userId: token.id,
      role: token.role 
    });

    // Return sanitized token data (exclude sensitive fields if any)
    const sanitizedToken = {
      id: token.id,
      email: token.email,
      name: token.name,
      role: token.role,
      roleLastFetched: token.roleLastFetched,
      roleLastFetchedDate: token.roleLastFetched 
        ? new Date(token.roleLastFetched as number).toISOString() 
        : null,
      iat: token.iat,
      exp: token.exp,
      jti: token.jti,
    };

    return NextResponse.json(sanitizedToken, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
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
