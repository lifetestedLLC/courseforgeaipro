# Admin Tier Display Troubleshooting Guide

## Issue
Admin users are seeing "free tier" and being prompted to upgrade despite having admin role.

## Root Causes

### 1. Database Role Not Set to 'admin'
**Symptom:** User sees "Free Plan" instead of "Enterprise Plan (Admin - Unlimited Access)"

**Diagnosis:**
```bash
npx tsx scripts/diagnose-admin.ts
```

**Fix:**
```bash
# Check the user's role
npx tsx scripts/fix-admin-role.ts <email>

# To automatically update role to admin
AUTO_FIX=true npx tsx scripts/fix-admin-role.ts <email>
```

### 2. Stale JWT Token (Most Common Cause)
**Symptom:** User was upgraded to admin but still sees free tier

**Root Cause:** 
- NextAuth caches the user's role in the JWT token when they first log in
- If a user's role is changed in the database AFTER they've logged in, their session token won't reflect the new role
- The token persists for 30 days by default

**Fix:**
The user must log out and log back in to refresh their JWT token with the new admin role.

**Steps:**
1. Log out of the application
2. Clear browser cookies (optional but recommended)
3. Log back in with admin credentials
4. Navigate to /account - should now show "Enterprise Plan (Admin - Unlimited Access)"

### 3. Session Not Being Used Correctly in API Calls
**Symptom:** Effective tier calculation works in some places but not others

**Diagnosis:**
Check that all API endpoints fetch the user's role from the database, not just from the session:

```typescript
// ✅ CORRECT - Fetches role from database
const user = await prisma.user.findUnique({
  where: { email: session.user?.email! },
  select: { 
    subscriptionTier: true,
    role: true,  // ← Important!
  },
});

// ❌ INCORRECT - Uses cached role from session
const userRole = session.user?.role;
```

## How It Should Work

### Database Structure
```typescript
User {
  role: 'admin' | 'user'
  subscriptionTier: 'free' | 'starter' | 'professional' | 'enterprise' | null
}
```

### Effective Tier Calculation
```typescript
function getEffectiveTier(userTier, userRole) {
  if (userRole === 'admin') {
    return 'enterprise';  // ← Admins ALWAYS get enterprise
  }
  return userTier || 'free';
}
```

### Admin User Display
| Field | Database Value | Displayed Value |
|-------|---------------|----------------|
| `role` | `'admin'` | `'admin'` |
| `subscriptionTier` | `null` or `'free'` | (not shown directly) |
| `effectiveTier` | (calculated) | `'enterprise'` |
| Account Page | - | "Enterprise Plan (Admin - Unlimited Access)" |
| Templates Badge | - | "Enterprise" |
| Upgrade Banner | - | Hidden |

## Verification Steps

### 1. Check Database
```bash
npx tsx scripts/diagnose-admin.ts
```

Expected output for admin:
```
✅ Found 1 admin user(s):
   Email: admin@courseforgeai.org
   Role: admin
   DB Subscription Tier: NULL
   Effective Tier: enterprise
✅ CORRECT: Effective tier is "enterprise" for admin
```

### 2. Check API Response
Log in as admin, then check:
```bash
curl -H "Cookie: <your-session-cookie>" http://localhost:3000/api/user/current
```

Expected response:
```json
{
  "id": "...",
  "email": "admin@courseforgeai.org",
  "role": "admin",
  "subscriptionTier": null,
  "effectiveTier": "enterprise"  ← Should be "enterprise"
}
```

### 3. Check UI
1. Navigate to `/account`
   - Should show: "Enterprise Plan (Admin - Unlimited Access)"
   
2. Navigate to `/templates`
   - Should show: "Enterprise" badge in top right
   - Should NOT show: "Unlock Premium Templates" upgrade banner
   - Should have: Green checkmark on all templates (no locks)

## Production Deployment Checklist

When deploying to production:

- [ ] Ensure admin user exists in production database
- [ ] Verify admin user has `role='admin'` in database
- [ ] Admin must log out and log back in after role change
- [ ] Test `/account` page shows enterprise tier
- [ ] Test `/templates` page shows no upgrade prompts
- [ ] Test `/admin` dashboard is accessible

## Common Mistakes

### ❌ Setting subscriptionTier instead of role
```sql
-- WRONG
UPDATE "User" SET "subscriptionTier" = 'enterprise' WHERE email = 'admin@example.com';
```

```sql
-- CORRECT
UPDATE "User" SET role = 'admin' WHERE email = 'admin@example.com';
```

### ❌ Expecting immediate effect without re-login
After changing a user's role in the database, they MUST log out and log back in.

### ❌ Checking session.user.role without refreshing it
The session role is cached. Always fetch fresh from database in API routes:
```typescript
// Fetch role fresh from database
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: { role: true }
});
```

## Files Involved

### Backend (Correctly Implemented)
- `/lib/subscription.ts` - `getEffectiveTier()` function
- `/app/api/user/current/route.ts` - Returns `effectiveTier`
- `/app/api/templates/route.ts` - Returns `effectiveTier` and `userTier`

### Frontend (Correctly Implemented)
- `/components/AccountClient.tsx` - Displays effective tier
- `/app/templates/page.tsx` - Uses `userTier` from API
- `/app/admin/page.tsx` - Admin dashboard

### Auth (Caches Role in JWT)
- `/lib/auth.ts` - JWT callback caches role from database

## Debug Tools (Temporary - Production Troubleshooting)

### Debug Token Endpoint

When admin users are seeing "Free Tier" in production despite having the correct role in the database, use the debug token endpoint to verify JWT token claims.

#### Setup (Production Only)
1. In Vercel Dashboard → Project Settings → Environment Variables
2. Add: `DEBUG_TOKEN_ROUTE=1` for Production environment
3. Redeploy the application (or trigger a new deployment)

#### Usage
1. Log in as the affected admin user
2. Visit: `https://your-domain.com/api/debug/token`
3. The endpoint returns JSON with token claims:

```json
{
  "id": "user-id",
  "email": "admin@example.com",
  "name": "Admin User",
  "role": "admin",
  "roleLastFetched": 1705723456789,
  "roleLastFetchedDate": "2024-01-20T04:37:36.789Z",
  "iat": 1705723400,
  "exp": 1708315400,
  "jti": "token-id"
}
```

#### What to Check
- **role**: Should be `"admin"` (not `"user"` or null)
- **roleLastFetched**: Should be within the last 5 minutes
- **roleLastFetchedDate**: Human-readable timestamp - verify it's recent

#### If Role is Wrong
1. Verify database has correct role: `npx tsx scripts/diagnose-admin.ts`
2. Check server logs for `[JWT] Role refresh` log entries
3. If role is correct in DB but wrong in token:
   - Log out completely
   - Clear browser cookies
   - Log back in
   - Check `/api/debug/token` again

#### Security Note
⚠️ **This endpoint exposes JWT token data.** Only enable when actively troubleshooting.
- Remove `DEBUG_TOKEN_ROUTE` environment variable after verification
- The endpoint returns 404 when the variable is not set

### JWT Refresh Logging

The JWT callback in `/lib/auth.ts` now logs when role refresh occurs:

```
[JWT] Role refresh { userId: "...", oldRole: "user", newRole: "admin", trigger: "periodic", lastFetched: "2024-01-20T04:32:36.789Z" }
```

#### Viewing Logs in Production (Vercel)
1. Go to Vercel Dashboard → Project → Logs
2. Filter by "JWT" to see role refresh activity
3. Look for entries when admin loads pages or logs in

#### What to Look For
- **Frequency**: Should refresh every 5 minutes when user is active
- **oldRole → newRole**: Track role changes (e.g., "user" → "admin")
- **trigger**: `"periodic"` for automatic refresh, `"update"` for forced refresh
- **lastFetched**: When role was last fetched (should not be "never" after first login)

## Support

If the issue persists after following these troubleshooting steps:

1. Check server logs for errors
2. Verify DATABASE_URL is correct
3. Run diagnostic script: `npx tsx scripts/diagnose-admin.ts`
4. Check browser console for API errors
5. Verify NextAuth session is working: Check cookies in browser dev tools

## Quick Fix Commands

```bash
# 1. Check admin user status
npx tsx scripts/diagnose-admin.ts

# 2. Fix admin role if needed
AUTO_FIX=true npx tsx scripts/fix-admin-role.ts admin@courseforgeai.org

# 3. Have admin user:
#    - Log out
#    - Log back in
#    - Check /account page
```

## Cleanup Checklist (After Debug Verification)

After using the debug tools to verify admin JWT tokens in production:

- [ ] **Remove debug endpoint**: Delete `/app/api/debug/token/route.ts`
- [ ] **Remove environment variable**: Delete `DEBUG_TOKEN_ROUTE` from Vercel environment variables
- [ ] **Remove debug logging** (optional): Remove or comment out `[JWT] Role refresh` logging in `/lib/auth.ts` if no longer needed
- [ ] **Redeploy**: Trigger new deployment to apply cleanup changes
- [ ] **Update this doc**: Add note that debug tools were temporary and have been removed

### Why Cleanup is Important
- The debug endpoint exposes JWT token claims
- Unnecessary logging can clutter production logs
- Temporary debugging code should not remain in production long-term
