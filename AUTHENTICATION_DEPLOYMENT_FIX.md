# Authentication Deployment Fix

## Problem
Authentication was working on localhost but not on the production domain. After creating an account, users could not log in on the public domain.

## Root Cause
The issue was caused by missing cookie configuration in NextAuth. By default, NextAuth uses cookies for session management, but these cookies need explicit configuration to work correctly across different environments:

1. **Localhost vs Production Domain**: Cookies behave differently on localhost vs production domains
2. **HTTP vs HTTPS**: Production domains typically use HTTPS, requiring secure cookie settings
3. **Missing Cookie Configuration**: Without explicit cookie settings, NextAuth may not set cookies correctly in production

## Solution Implemented

### 1. Added Explicit Cookie Configuration
Updated `/lib/auth.ts` to include explicit cookie configuration:

```typescript
cookies: {
  sessionToken: {
    name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
  },
}
```

**Key Settings:**
- **`httpOnly: true`**: Prevents JavaScript from accessing the cookie (security)
- **`sameSite: "lax"`**: Allows cookies to be sent with same-site requests and top-level navigation
- **`secure: true` (production)**: Ensures cookies are only sent over HTTPS in production
- **`__Secure-` prefix (production)**: Browser requirement for secure cookies on HTTPS

### 2. Added Session Max Age
Set session duration to 30 days for better user experience:

```typescript
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

### 3. Updated Environment Variable Documentation
Updated `.env.example` to clarify `NEXTAUTH_URL` requirements:
- For local development: `http://localhost:3000`
- For production: `https://yourdomain.com` (must match your actual domain with HTTPS)

## Deployment Checklist

### For Production Deployment (Vercel, Netlify, etc.)

1. **Set Environment Variables** in your hosting platform:
   ```
   NEXTAUTH_SECRET=<your-generated-secret>
   NEXTAUTH_URL=https://yourdomain.com
   DATABASE_URL=<your-database-connection-string>
   ```

2. **Generate NEXTAUTH_SECRET** (if you haven't already):
   ```bash
   openssl rand -base64 32
   ```

3. **Ensure NEXTAUTH_URL matches your domain exactly**:
   - Include `https://` for production
   - Use your actual domain name
   - Do not include trailing slash
   - Examples:
     - ✅ `https://courseforgeai.org`
     - ✅ `https://www.courseforgeai.org`
     - ❌ `http://courseforgeai.org` (should be https)
     - ❌ `https://courseforgeai.org/` (no trailing slash)

4. **Verify your domain uses HTTPS**:
   - Most modern hosting platforms (Vercel, Netlify) provide automatic SSL/HTTPS
   - Ensure your SSL certificate is valid and active

5. **Redeploy your application** after setting environment variables

### For Custom Server Deployment

If deploying to your own server (VPS, AWS, etc.):

1. **Set up SSL/HTTPS** using Let's Encrypt:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

2. **Set environment variables** in your deployment:
   ```bash
   export NODE_ENV=production
   export NEXTAUTH_SECRET=<your-secret>
   export NEXTAUTH_URL=https://yourdomain.com
   export DATABASE_URL=<your-database-url>
   ```

3. **Build and start** the application:
   ```bash
   npm run build
   npm start
   ```

## Testing Authentication After Deployment

1. **Clear browser cookies** before testing to ensure clean state
2. **Navigate to your domain** (e.g., `https://yourdomain.com`)
3. **Create a new account** at `/register`
4. **Check that you're redirected** to login page after registration
5. **Log in** with your credentials
6. **Verify you're redirected** to dashboard
7. **Refresh the page** - you should remain logged in
8. **Close and reopen browser** - you should still be logged in (for 30 days)

## Troubleshooting

### Still can't log in after deployment?

1. **Check browser console** for errors:
   - Open Developer Tools (F12)
   - Look for any network errors or cookie-related warnings

2. **Verify environment variables** are set correctly in your hosting platform:
   - Check that `NEXTAUTH_URL` matches your exact domain with HTTPS
   - Ensure `NEXTAUTH_SECRET` is set and not empty
   - Confirm `DATABASE_URL` is correct and accessible

3. **Check browser cookies**:
   - Open Developer Tools > Application/Storage > Cookies
   - Look for `__Secure-next-auth.session-token` (production) or `next-auth.session-token` (localhost)
   - If cookie is not set, there may be a domain mismatch

4. **Review server logs** in your hosting platform:
   - Look for authentication errors
   - Check for database connection issues
   - Look for environment variable warnings

5. **Common issues**:
   - **Mixed content warnings**: Ensure all resources load over HTTPS
   - **Domain mismatch**: `NEXTAUTH_URL` must exactly match your domain
   - **Database not accessible**: Check database connection from your hosting platform
   - **CORS issues**: Ensure your API routes don't have CORS restrictions

### Cookie not being set?

If the session cookie is not being set in the browser:

1. **Verify HTTPS is active** - secure cookies require HTTPS in production
2. **Check domain configuration** - ensure your domain DNS is properly configured
3. **Clear all cookies** and try again
4. **Try incognito/private mode** to rule out browser extensions

### Session expires immediately?

1. **Check server time** - ensure your server clock is accurate
2. **Verify JWT secret** - ensure `NEXTAUTH_SECRET` hasn't changed
3. **Check session maxAge** - default is now 30 days

## Summary of Changes

### Files Modified
1. **`/lib/auth.ts`**:
   - Added explicit cookie configuration with secure settings
   - Added session maxAge of 30 days
   - Configured environment-specific cookie names and security

2. **`/.env.example`**:
   - Added documentation for `NEXTAUTH_URL` configuration
   - Clarified localhost vs production URL requirements

### What This Fixes
✅ Authentication now works on production domains with HTTPS
✅ Session cookies are properly set with secure flags
✅ Sessions persist for 30 days (configurable)
✅ Cookies work correctly across localhost and production environments
✅ Security best practices applied (httpOnly, secure, sameSite)

## Additional Notes

- **No changes required** for existing users - this is a configuration fix
- **Backward compatible** - still works on localhost
- **Security enhanced** - cookies use proper security flags
- **No database changes** - purely authentication/session configuration

## Need Help?

If you're still experiencing issues after following this guide:
1. Check the server logs in your hosting platform
2. Verify all environment variables are set correctly
3. Ensure your domain has a valid SSL certificate
4. Try testing in incognito mode to rule out cached data
5. Check that your database is accessible from your hosting platform

## References
- [NextAuth.js Deployment Guide](https://next-auth.js.org/deployment)
- [NextAuth.js Cookie Configuration](https://next-auth.js.org/configuration/options#cookies)
- [MDN Web Docs: Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
