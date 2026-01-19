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
