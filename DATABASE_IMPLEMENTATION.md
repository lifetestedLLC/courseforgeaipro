# Database Implementation Guide

## Overview

Phase 5 adds PostgreSQL database integration using Prisma ORM for persistent data storage, user management, subscription tracking, and usage limit enforcement.

## Tech Stack

- **Database**: PostgreSQL
- **ORM**: Prisma
- **Features**: User management, content storage, subscription tracking, usage limits

## Database Schema

### User Model
Stores user authentication and subscription data:
- Basic info: email, name, password
- Stripe integration: customer ID, subscription ID, price ID
- Subscription: tier, status, period end
- Usage tracking: courses/videos/quizzes created this month

### Course Model
Stores AI-generated courses:
- Title, description, level, duration
- JSON content (modules, lessons, objectives)
- Status (draft/published)
- Linked to user

### Video Model
Stores AI-generated video scripts:
- Title, description, duration, style
- JSON script (hook, sections, voiceover)
- Status (draft/published)
- Linked to user

### Quiz Model
Stores AI-generated quizzes:
- Title, description, topic, difficulty
- JSON questions (MC with explanations)
- Status (draft/published)
- Linked to user

## Setup Instructions

### 1. Install PostgreSQL

**Option A: Local PostgreSQL**
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from: https://www.postgresql.org/download/windows/
```

**Option B: Docker**
```bash
docker run --name courseforgeai-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=courseforgeai \
  -p 5432:5432 \
  -d postgres:15
```

**Option C: Cloud Database (Recommended for Production)**
- **Vercel Postgres**: https://vercel.com/storage/postgres
- **Neon**: https://neon.tech (Serverless PostgreSQL)
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app

### 2. Configure Environment

Add to `.env.local`:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/courseforgeai"
```

**Format**: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

**Examples**:
- Local: `postgresql://postgres:password@localhost:5432/courseforgeai`
- Docker: `postgresql://postgres:password@localhost:5432/courseforgeai`
- Vercel: Provided automatically
- Neon: `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`

### 3. Generate Prisma Client

```bash
npx prisma generate
```

This creates the Prisma client in `node_modules/@prisma/client`.

### 4. Run Database Migrations

**Create and apply migrations**:
```bash
npx prisma migrate dev --name init
```

This:
1. Creates migration files in `prisma/migrations/`
2. Applies schema to your database
3. Regenerates Prisma Client

**For production**:
```bash
npx prisma migrate deploy
```

### 5. Verify Setup

```bash
# Open Prisma Studio (database GUI)
npx prisma studio
```

Browse to http://localhost:5555 to view your database.

## Usage

### Import Prisma Client

```typescript
import { prisma } from '@/lib/prisma';
```

### Create User

```typescript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    password: hashedPassword,
  },
});
```

### Find User

```typescript
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
});
```

### Update Subscription

```typescript
await prisma.user.update({
  where: { id: userId },
  data: {
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    subscriptionTier: 'professional',
    subscriptionStatus: 'active',
  },
});
```

### Save Course

```typescript
const course = await prisma.course.create({
  data: {
    userId: user.id,
    title: 'Introduction to Python',
    description: 'Learn Python basics',
    level: 'beginner',
    duration: 4,
    content: aiGeneratedContent, // JSON
    status: 'draft',
  },
});
```

### Get User's Courses

```typescript
const courses = await prisma.course.findMany({
  where: { userId: user.id },
  orderBy: { createdAt: 'desc' },
});
```

### Track Usage

```typescript
// Increment courses created
await prisma.user.update({
  where: { id: userId },
  data: {
    coursesCreatedThisMonth: {
      increment: 1,
    },
  },
});
```

### Check Usage Limits

```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
});

const limits = {
  starter: { courses: 20, videos: 25 },
  professional: { courses: 40, videos: 65 },
  enterprise: { courses: Infinity, videos: Infinity },
};

const tier = user.subscriptionTier || 'starter';
const hasReachedLimit = 
  user.coursesCreatedThisMonth >= limits[tier].courses;
```

## Migration Commands

### Create Migration
```bash
npx prisma migrate dev --name description
```

### Apply Migrations (Production)
```bash
npx prisma migrate deploy
```

### Reset Database (Development Only)
```bash
npx prisma migrate reset
```

### View Migrations
```bash
npx prisma migrate status
```

## Prisma Studio

Interactive database browser:
```bash
npx prisma studio
```

Features:
- View all tables and data
- Edit records directly
- Filter and search
- Run queries

## Database Seeding

Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      subscriptionTier: 'professional',
      subscriptionStatus: 'active',
    },
  });

  console.log('Database seeded!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
```

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Run seed:
```bash
npx prisma db seed
```

## Environment Variables

### Development
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/courseforgeai"
```

### Production (Vercel)
Set in Vercel Dashboard → Project → Settings → Environment Variables

### Production (Other)
Use your cloud provider's connection string with SSL:
```bash
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

## Backup & Restore

### Backup
```bash
pg_dump -h localhost -U postgres -d courseforgeai > backup.sql
```

### Restore
```bash
psql -h localhost -U postgres -d courseforgeai < backup.sql
```

## Performance Tips

### Indexes
The schema includes indexes on frequently queried fields:
- User email, Stripe IDs
- Course/Video/Quiz userId and status

### Connection Pooling
For serverless environments, use connection pooling:
```bash
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true"
```

### Query Optimization
```typescript
// Include relations in one query
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    courses: true,
    videos: true,
    quizzes: true,
  },
});
```

## Monitoring

### Prisma Pulse
Real-time database events: https://www.prisma.io/pulse

### Prisma Accelerate
Global database caching: https://www.prisma.io/accelerate

## Troubleshooting

### "Can't reach database"
- Check PostgreSQL is running
- Verify DATABASE_URL format
- Test connection: `psql $DATABASE_URL`

### "P1001: Can't reach database server"
- Check firewall rules
- Verify host and port
- Ensure SSL mode if required

### "P1003: Database does not exist"
Create the database:
```bash
createdb courseforgeai
```

### Migration conflicts
Reset (development only):
```bash
npx prisma migrate reset
```

## Next Steps

1. Update authentication to use database
2. Modify AI generation endpoints to save content
3. Implement usage limit checks
4. Add Stripe webhook handlers for subscription updates
5. Build course/video/quiz management pages

## Security

- ✅ Password hashing (bcryptjs)
- ✅ SQL injection protection (Prisma)
- ✅ Connection string in environment variables
- ✅ Cascade deletes for user data
- ✅ Indexed sensitive fields

## Resources

- Prisma Docs: https://www.prisma.io/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Prisma Examples: https://github.com/prisma/prisma-examples
- Database Security: https://www.prisma.io/docs/guides/security

## Cost Estimates

**Development**: Free (local PostgreSQL)

**Production**:
- Vercel Postgres: $0-$20/month
- Neon: $0-$19/month (free tier available)
- Supabase: $0-$25/month (free tier available)
- Railway: $5-$20/month

Choose based on:
- Database size
- Connection limits
- Geographic requirements
- Backup needs
