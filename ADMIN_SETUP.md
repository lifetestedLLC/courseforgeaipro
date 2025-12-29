# Admin User Setup Guide

## Creating an Admin User

The application includes a seed script to create an admin user for testing and managing the application.

### Quick Setup

Run the seed script to create the default admin user:

```bash
npm run db:seed
```

### Default Admin Credentials

After running the seed script, you can login with:

- **Email**: `admin@courseforgeai.org`
- **Password**: `Admin123!`
- **Role**: `admin`

### ⚠️ Security Important

**ALWAYS change the default admin password immediately after first login!**

The default credentials are provided for initial setup and testing only.

### Manual Admin User Creation

If you prefer to create an admin user manually:

1. **Using Prisma Studio**:
   ```bash
   npm run db:studio
   ```
   - Navigate to the `User` model
   - Create a new user with `role: "admin"`
   - Use a hashed password (you can generate one using the registration endpoint or bcrypt)

2. **Using SQL directly**:
   ```sql
   -- First, hash your password using bcrypt (strength: 12)
   -- Then insert the user:
   INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
   VALUES (
     'your-generated-id',
     'your-email@example.com',
     'Your Name',
     'your-hashed-password',
     'admin',
     NOW(),
     NOW()
   );
   ```

### Admin Features

Admin users have the same access as regular users currently. You can extend admin-specific features by:

1. Checking the user's role in API routes:
   ```typescript
   import { getServerSession } from "next-auth/next";
   import { authOptions } from "@/lib/auth";
   
   const session = await getServerSession(authOptions);
   const user = await prisma.user.findUnique({
     where: { id: session.user.id }
   });
   
   if (user.role !== 'admin') {
     return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
   }
   ```

2. Creating admin-only pages in the dashboard

### Testing with Admin Account

The admin account is useful for:

1. **Testing features**: Create courses, videos, and quizzes without limitations
2. **Marketing content**: Generate demo content for videos and screenshots
3. **Feature validation**: Test all application features before production release
4. **User management**: Future feature to manage other users

### Resetting Admin Password

To reset the admin password:

1. **Using the seed script**: Delete the existing admin user and run `npm run db:seed` again
2. **Using Prisma Studio**: 
   - Open Prisma Studio (`npm run db:studio`)
   - Find the admin user
   - Update the password field with a new bcrypt hash
3. **Using the forgot password feature** (when implemented)

### Environment-Specific Admins

For different environments, you can modify the seed script:

- **Development**: Use the default credentials
- **Staging**: Create a staging-specific admin
- **Production**: Create a production admin with a strong password

Example modification in `prisma/seed.ts`:

```typescript
const adminEmail = process.env.ADMIN_EMAIL || 'admin@courseforgeai.org';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
```

Then set environment variables accordingly.

### Multiple Admin Users

To create additional admin users:

1. Run the registration endpoint with a new email
2. Update the user's role to 'admin' using Prisma Studio or SQL:
   ```sql
   UPDATE "User" SET role = 'admin' WHERE email = 'another-admin@example.com';
   ```

### Admin Role Benefits

Current benefits:
- Full access to all features
- Identified in server logs with role information
- Foundation for future admin-specific features

Planned benefits (future):
- User management dashboard
- System analytics and monitoring
- Content moderation tools
- Subscription management
- System configuration access
