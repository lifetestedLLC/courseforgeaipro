# Admin Privileges Documentation

## Overview

Admin users in CourseForge AI Pro have unrestricted access to all platform features, regardless of their subscription tier. This document describes the admin privileges and how they are implemented.

## Admin Capabilities

Admin users automatically receive the following privileges:

### 1. **Unlimited Content Creation**
- **Unlimited courses per month** (no limit)
- **Unlimited AI video scripts per month** (no limit)
- **Unlimited quizzes per month** (no limit)

Regular users are subject to monthly limits based on their subscription tier, but admins bypass all limits.

### 2. **Full Template Access**
- Access to **all PDF export templates** across all tiers:
  - Free tier templates
  - Starter tier templates
  - Professional tier templates
  - Enterprise tier templates

Admins can use any template without needing to upgrade their subscription.

### 3. **Enterprise-Level Features**
- All integrations (basic, advanced, and custom)
- Priority/24-7 support access
- Advanced analytics capabilities
- White-label options
- Team collaboration features

## Implementation Details

### How Admin Privileges Work

Admin privileges are implemented through the subscription utility functions in `/lib/subscription.ts`. The system checks the user's `role` field in the database:

```typescript
// Check if user is admin
if (userRole === 'admin') {
  // Grant unlimited access to all features
}
```

### Key Functions

#### `isAdmin(userRole)`
Checks if a user has admin privileges.

```typescript
isAdmin('admin') // returns true
isAdmin('user')  // returns false
```

#### `getEffectiveTier(userTier, userRole)`
Returns the effective subscription tier for a user. Admins always get `'enterprise'` tier.

```typescript
getEffectiveTier('starter', 'admin') // returns 'enterprise'
getEffectiveTier('starter', 'user')  // returns 'starter'
```

#### `hasAccessToTier(userTier, userRole, requiredTier)`
Checks if a user has access to features in a specific tier. Admins have access to all tiers.

```typescript
hasAccessToTier(null, 'admin', 'enterprise') // returns true
hasAccessToTier('free', 'user', 'enterprise') // returns false
```

#### `hasUnlimitedUsage(userTier, userRole, feature)`
Checks if a user has unlimited usage for a specific feature (courses, videos, quizzes). Admins always have unlimited usage.

```typescript
hasUnlimitedUsage('starter', 'admin', 'courses') // returns true
hasUnlimitedUsage('starter', 'user', 'courses')  // returns false
```

#### `getUsageLimit(userTier, userRole, feature)`
Returns the usage limit for a feature. Returns `-1` for unlimited access. Admins always get `-1`.

```typescript
getUsageLimit('starter', 'admin', 'courses') // returns -1 (unlimited)
getUsageLimit('starter', 'user', 'courses')  // returns 20
```

## Where Admin Privileges Are Applied

### 1. Template Access (`/app/api/templates/route.ts`)
The templates API checks the user's role when determining which templates are accessible:

```typescript
const user = await prisma.user.findUnique({
  where: { email: session.user?.email! },
  select: { subscriptionTier: true, role: true },
});

// This function automatically grants admins access to all templates
hasAccessToTemplate(userTier, template.tier, userRole)
```

### 2. Template Details (`/app/api/templates/[id]/route.ts`)
Individual template endpoints also respect admin privileges:

```typescript
const hasAccess = hasAccessToTemplate(userTier, template.tier, userRole);
```

### 3. Template Helper (`/lib/templates.ts`)
The `hasAccessToTemplate` function uses the subscription utility to check access:

```typescript
export function hasAccessToTemplate(
  userTier: SubscriptionTier | null | undefined, 
  templateTier: SubscriptionTier,
  userRole?: string | null | undefined
): boolean {
  return hasAccessToTier(userTier, userRole, templateTier);
}
```

## Creating Admin Users

Admin users are created through the database seed script (`npm run db:seed`) or can be manually set in the database:

### Option 1: Using Seed Script
```bash
# Set admin credentials in environment variables (optional)
export ADMIN_EMAIL="admin@example.com"
export ADMIN_PASSWORD="SecurePassword123!"
export ADMIN_NAME="Admin User"

# Run seed script
npm run db:seed
```

### Option 2: Manual Database Update
```sql
UPDATE "User" 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

## Security Considerations

1. **Admin accounts should be protected** with strong passwords
2. **Limit the number of admin accounts** to only necessary personnel
3. **Monitor admin activity** through logs and analytics
4. **Regular security audits** of admin accounts

## Future Enhancements

Potential improvements for admin privileges:

1. **Admin Activity Logging**: Track all actions performed by admin users
2. **Granular Permissions**: Implement role-based access control with different admin levels
3. **Admin Analytics Dashboard**: Special dashboard showing system-wide metrics
4. **Audit Trail**: Maintain a detailed audit trail of admin actions
5. **Multi-Factor Authentication**: Require MFA for admin accounts

## Testing Admin Privileges

To verify admin privileges are working correctly:

1. **Create a test admin user** through the seed script
2. **Log in** with the admin credentials
3. **Navigate to the Templates page** (`/templates`)
4. **Verify all templates are accessible** (no "Upgrade Required" locks)
5. **Check the admin dashboard** shows unlimited usage capabilities
6. **Test AI generation features** without hitting limits

## Support

For issues related to admin privileges:
1. Check the user's `role` field in the database
2. Verify the subscription utility functions are being called correctly
3. Review the API route implementations
4. Check browser console for any errors

## Changelog

### Version 1.0 (Current)
- Initial implementation of admin privileges
- Unlimited content creation for admins
- Full template access for admins
- Enterprise-level features for admins
