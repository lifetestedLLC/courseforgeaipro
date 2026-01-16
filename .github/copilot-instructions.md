# GitHub Copilot Instructions for CourseForge AI Pro

## Project Overview

CourseForge AI Pro is an AI-powered course creation platform for educators and content creators. The platform enables users to generate comprehensive course outlines, create AI-generated videos, build interactive quizzes, and export to various learning platforms.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x
- **Icons**: Lucide React
- **Authentication**: NextAuth.js v4
- **Database ORM**: Prisma 7.x
- **Database**: PostgreSQL (Prisma Postgres for local development)
- **Payment Processing**: Stripe
- **AI Features**: OpenAI API
- **Package Manager**: npm

## Project Structure

```
/app                 - Next.js App Router pages and API routes
  /api              - API endpoints
  /components       - Page-specific components
  /[feature]        - Feature-specific pages (dashboard, courses, etc.)
/components         - Shared/reusable React components
/lib                - Utility functions and shared logic
/prisma            - Database schema and seed files
/types             - TypeScript type definitions
```

## Development Workflow

### Setup Commands

```bash
# Install dependencies
npm install

# Start local database (keep running in separate terminal)
npx prisma dev

# Initialize database (first time only)
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

### Database Commands

```bash
npm run db:generate   # Generate Prisma Client
npm run db:push       # Push schema changes to database
npm run db:migrate    # Create and run migrations
npm run db:studio     # Open Prisma Studio GUI
npm run db:seed       # Seed database with initial data
```

### Build and Lint

```bash
npm run build         # Build for production (includes Prisma generate)
npm run lint          # Run ESLint
```

## Coding Standards

### TypeScript

- **Always use TypeScript** for all new files
- Use strict type checking - avoid `any` types
- Define interfaces for complex objects and component props
- Use type imports: `import type { User } from '@prisma/client'`
- Prefer `interface` over `type` for object shapes

### React/Next.js

- Use **React Server Components** by default
- Only add `'use client'` directive when necessary (interactive components, hooks, browser APIs)
- Use Next.js App Router conventions (not Pages Router)
- Implement proper loading states with `loading.tsx`
- Implement error boundaries with `error.tsx`
- Use Next.js Image component for images
- Follow Next.js file-based routing conventions

### Components

- Create functional components with TypeScript
- Use descriptive component names (PascalCase)
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Place shared components in `/components` directory
- Place page-specific components in `/app/[feature]/components`

### Styling

- Use **Tailwind CSS** for all styling
- Follow mobile-first responsive design
- Use Tailwind's built-in classes instead of custom CSS
- Use Lucide React for icons consistently
- Maintain consistent spacing and color schemes

### API Routes

- Place API routes in `/app/api/[endpoint]/route.ts`
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Always validate request data
- Return proper HTTP status codes
- Handle errors gracefully with try-catch blocks
- Use NextAuth for authentication checks

### Database/Prisma

- **Never modify the database schema directly** - always use Prisma migrations
- Run `npm run db:push` during development
- Run `npm run db:migrate` for production-ready migrations
- Use Prisma Client for all database operations
- Always handle database errors properly
- Use transactions for multiple related operations
- Follow the existing schema patterns in `prisma/schema.prisma`

### Authentication

- Use NextAuth.js for all authentication
- Check authentication in API routes using `getServerSession`
- Protect pages with middleware or server-side checks
- Never expose sensitive user data in client components
- Store sensitive configuration in environment variables

### Environment Variables

- **Never commit `.env` files** to the repository
- Use `.env.example` as a template
- Required environment variables:
  - `DATABASE_URL` - Prisma Postgres connection string
  - `NEXTAUTH_SECRET` - NextAuth.js secret key
  - `NEXTAUTH_URL` - Application URL
  - `STRIPE_SECRET_KEY` - Stripe API key
  - `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
  - `OPENAI_API_KEY` - OpenAI API key
- Access environment variables with `process.env.VARIABLE_NAME`
- Validate required environment variables on startup

## Security Guidelines

- **Never commit secrets or API keys** to source control
- Always sanitize user input before database operations
- Use parameterized queries (Prisma does this by default)
- Validate and sanitize all API route inputs
- Implement proper authentication checks on protected routes
- Use HTTPS in production
- Follow OWASP security best practices
- Use bcrypt for password hashing (via NextAuth)
- Implement rate limiting for sensitive operations

## Testing and Validation

- Always test database changes locally before deploying
- Verify authentication flows work correctly
- Test payment integration in Stripe test mode
- Validate API routes return expected responses
- Check for TypeScript errors with `npm run build`
- Run ESLint with `npm run lint`
- Test responsive design across different screen sizes

## Common Patterns

### Fetching Data in Server Components

```typescript
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export default async function Page() {
  const session = await getServerSession();
  const data = await prisma.model.findMany();
  return <div>{/* render data */}</div>;
}
```

### Creating API Routes

```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    // Process request
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### Using Prisma

```typescript
import { prisma } from '@/lib/prisma';

// Create
const user = await prisma.user.create({
  data: { email, name }
});

// Read
const users = await prisma.user.findMany({
  where: { active: true }
});

// Update
await prisma.user.update({
  where: { id },
  data: { name: newName }
});

// Delete
await prisma.user.delete({
  where: { id }
});
```

## Documentation

- Update README.md for user-facing feature changes
- Update relevant documentation files in the root directory
- Add JSDoc comments for complex functions
- Keep GETTING_STARTED.md current with setup instructions
- Document breaking changes in deployment guides

## Deployment

- The application is deployed on Vercel
- See VERCEL_DEPLOYMENT.md for deployment instructions
- Database connection is managed via environment variables
- Always run `npm run build` locally before deploying
- Prisma generates client during build process

## Don't Do

- ❌ Don't use Pages Router patterns (use App Router)
- ❌ Don't commit `.env` files or secrets
- ❌ Don't modify database schema without Prisma migrations
- ❌ Don't use inline styles (use Tailwind CSS)
- ❌ Don't skip authentication checks on protected routes
- ❌ Don't use `any` type in TypeScript
- ❌ Don't install unnecessary dependencies
- ❌ Don't modify the database schema without testing locally first
- ❌ Don't expose API keys or secrets in client-side code

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
