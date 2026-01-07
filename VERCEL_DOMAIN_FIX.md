# Vercel Domain Fix

## Problem

When deploying a Next.js application to Vercel with a custom domain, users may be redirected to the Vercel deployment URL (e.g., `yourapp.vercel.app`) instead of staying on the custom domain (e.g., `courseforgeai.org`). This commonly occurs with:

- OAuth redirects (NextAuth)
- Stripe payment callbacks
- Any server-side redirects using hardcoded environment variables

## Root Cause

The issue typically happens when:
1. `NEXTAUTH_URL` or similar environment variables are set to the Vercel deployment URL
2. Server-side code uses these environment variables for redirect URLs
3. Users access the site via the custom domain but get redirected to the Vercel URL

## Solution

This project implements a comprehensive fix with three components:

### 1. Dynamic URL Detection (`lib/url.ts`)

A utility function that detects the actual domain being accessed from request headers:

```typescript
export function getBaseUrl(request: Request): string {
  const headers = request.headers;
  
  // Get the host from headers (handles custom domains)
  const host = headers.get('x-forwarded-host') || headers.get('host');
  
  if (host) {
    const proto = headers.get('x-forwarded-proto') || 
                  (host.includes('localhost') ? 'http' : 'https');
    return `${proto}://${host}`;
  }
  
  // Fallback to NEXTAUTH_URL if set
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  return 'http://localhost:3000';
}
```

This function:
- Checks `x-forwarded-host` header (set by Vercel for custom domains)
- Falls back to `host` header
- Uses `x-forwarded-proto` to determine http/https
- Falls back to `NEXTAUTH_URL` environment variable
- Final fallback to localhost for development

### 2. Updated API Routes

All API routes that create redirect URLs now use dynamic URL detection:

**Before:**
```typescript
return_url: `${process.env.NEXTAUTH_URL}/dashboard`
```

**After:**
```typescript
const baseUrl = getBaseUrl(request);
return_url: `${baseUrl}/dashboard`
```

This ensures redirects always use the domain the user is accessing.

### 3. Vercel Configuration (`vercel.json`)

Automatic redirect from Vercel URL to custom domain:

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "(?<host>.*\\.vercel\\.app)"
        }
      ],
      "destination": "https://courseforgeai.org/:path*",
      "permanent": true
    }
  ]
}
```

This catches any traffic to `*.vercel.app` and redirects to the custom domain.

## Benefits

1. **User Experience**: Users always stay on the branded custom domain
2. **SEO**: Prevents duplicate content issues with multiple domains
3. **Consistency**: All redirects and callbacks use the correct domain
4. **No Configuration Required**: Works automatically in all environments
5. **Development Safe**: Still works in local development

## Affected Features

This fix improves:
- ✅ Stripe checkout redirects (success/cancel URLs)
- ✅ Stripe billing portal redirects
- ✅ Any future OAuth providers
- ✅ Any server-side redirects

## Testing

To verify the fix works:

1. Access the site via custom domain: `https://courseforgeai.org`
2. Start a Stripe checkout process
3. After payment, verify you're redirected back to `https://courseforgeai.org/dashboard` (not `*.vercel.app`)
4. Check Stripe billing portal redirects similarly

## Environment Setup

Set `NEXTAUTH_URL` to your custom domain in Vercel environment variables:

```
NEXTAUTH_URL=https://courseforgeai.org
```

Even if this is incorrectly set, the dynamic detection will ensure users stay on the domain they're accessing.

## Implementation Details

Files changed:
- `lib/url.ts` - New utility for dynamic URL detection
- `app/api/stripe/portal/route.ts` - Updated to use dynamic URLs
- `app/api/stripe/create-checkout/route.ts` - Updated to use dynamic URLs
- `vercel.json` - Added redirect rules
- `next.config.js` - Added headers configuration

## Future Considerations

When adding new features that involve redirects:
1. Always use `getBaseUrl(request)` instead of hardcoded URLs
2. Never use `process.env.NEXTAUTH_URL` directly in API routes
3. Test with both custom domain and Vercel preview deployments
