/**
 * Get the base URL for the application from the request headers.
 * This ensures that redirects use the actual domain being accessed (custom domain)
 * rather than the Vercel deployment URL.
 * 
 * Priority:
 * 1. x-forwarded-host header (set by Vercel for custom domains)
 * 2. host header
 * 3. NEXTAUTH_URL environment variable
 * 4. Fallback to localhost
 */
export function getBaseUrl(request: Request): string {
  const headers = request.headers;
  
  // Get the host from headers (handles custom domains)
  const host = headers.get('x-forwarded-host') || headers.get('host');
  
  if (host) {
    // Get protocol from x-forwarded-proto or assume https in production
    const proto = headers.get('x-forwarded-proto') || 
                  (host.includes('localhost') ? 'http' : 'https');
    return `${proto}://${host}`;
  }
  
  // Fallback to NEXTAUTH_URL if set
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // Final fallback for development
  return 'http://localhost:3000';
}
