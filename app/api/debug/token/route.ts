import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Temporary debug endpoint to verify NextAuth JWT token contents in production.
 * GATED by DEBUG_TOKEN_ROUTE environment variable - must be set to '1' to enable.
 * 
 * This endpoint helps diagnose JWT role refresh behavior by exposing the server-side
 * token contents. Should be removed after verification is complete.
 * 
 * Usage:
 * 1. Set DEBUG_TOKEN_ROUTE=1 in environment variables
 * 2. Redeploy application
 * 3. Call GET /api/debug/token while authenticated as admin
 * 4. Review returned token data (role, roleLastFetched, etc.)
 * 5. Remove this endpoint and unset DEBUG_TOKEN_ROUTE after diagnosis
 */
export async function GET(request: NextRequest) {
  // Check if debug endpoint is enabled via environment variable
  if (process.env.DEBUG_TOKEN_ROUTE !== '1') {
    return NextResponse.json(
      { error: 'Debug endpoint disabled' },
      { status: 403 }
    );
  }

  try {
    // Get the JWT token from the request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: 'No token found - user not authenticated' },
        { status: 401 }
      );
    }

    // Additional security: only allow admin users to access debug endpoint
    if (token.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - admin access required' },
        { status: 403 }
      );
    }

    // Return token data for debugging (non-sensitive fields only)
    // This helps verify that role refresh logic is working
    return NextResponse.json({
      userId: token.sub || token.id,
      email: token.email,
      role: token.role,
      roleLastFetched: token.roleLastFetched,
      iat: token.iat,
      exp: token.exp,
      // Include timestamp info for debugging token refresh
      currentTime: Date.now(),
      timeSinceRoleFetch: token.roleLastFetched 
        ? Date.now() - (token.roleLastFetched as number)
        : null,
    });
  } catch (error) {
    console.error('[DEBUG TOKEN ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to retrieve token' },
      { status: 500 }
    );
  }
}
