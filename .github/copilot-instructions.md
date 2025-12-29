# CourseForge AI Pro - Copilot Instructions

## Project Overview

CourseForge AI Pro is an AI-powered course creation platform for educators and content creators. The application enables users to:
- Generate comprehensive course outlines and content using AI
- Create professional educational videos with AI assistance
- Build interactive quizzes automatically
- Export content to multiple learning platforms (Coursera, Udemy, Teachable, etc.)
- Manage all courses through a centralized creator dashboard

**Domain:** courseforgeai.org

## Tech Stack

### Core Technologies
- **Framework:** Next.js 16 (App Router)
- **React:** Version 19
- **Language:** TypeScript (Target: ES2020)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Build Tool:** Turbopack (Next.js built-in)

### Backend & Database
- **ORM:** Prisma 7.2
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js v4
- **Password Hashing:** bcryptjs

### Third-Party Integrations
- **AI:** OpenAI API (for course/video/quiz generation)
- **Payments:** Stripe
- **Database Adapter:** @prisma/adapter-pg

## TypeScript Configuration

### Compiler Settings
- Target: ES2020
- Module: esnext
- Module Resolution: bundler
- JSX: react-jsx
- Strict mode enabled
- Path alias: `@/*` maps to root directory

### Import Patterns
```typescript
// Use path alias for imports
import Component from '@/components/Component';
import { helper } from '@/lib/utils';
import type { User } from '@/types';
```

## Coding Guidelines

### General Principles
- Write clean, maintainable, and well-documented code
- Follow TypeScript strict mode requirements
- Prefer functional components and React hooks
- Use Server Components by default (add 'use client' only when necessary)
- Keep components focused and single-purpose

### Naming Conventions
- **Files:** Use PascalCase for React components (e.g., `PricingCard.tsx`)
- **Variables/Functions:** Use camelCase (e.g., `getUserData`, `isActive`)
- **Types/Interfaces:** Use PascalCase (e.g., `User`, `CourseData`)
- **Constants:** Use UPPER_SNAKE_CASE for true constants (e.g., `API_URL`)
- **CSS Classes:** Use Tailwind utility classes

### Code Style
- Use single quotes for strings in TypeScript/JavaScript
- 2-space indentation across all files
- Always use semicolons
- Use arrow functions for callbacks and small functions
- Prefer `const` over `let`, avoid `var`
- Use template literals for string interpolation

### React/Next.js Patterns
- Leverage Next.js App Router conventions
- Place page components in `app/` directory
- Use React Server Components for data fetching when possible
- Add 'use client' directive only when using client-side features (hooks, event handlers, browser APIs)
- Keep API routes in `app/api/` directory following Next.js conventions
- Use dynamic imports for code splitting when appropriate

### Component Structure
```typescript
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

export default function Component({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}
```

## Database & Prisma

### Schema Conventions
- Use `cuid()` for primary keys
- Include `createdAt` and `updatedAt` timestamps
- Add appropriate indexes for frequently queried fields
- Use cascading deletes where appropriate
- Store structured data in `Json` fields (e.g., course content, quiz questions)

### Prisma Commands
```bash
npm run db:generate    # Generate Prisma Client
npm run db:push        # Push schema changes to database
npm run db:migrate     # Create and run migrations
npm run db:studio      # Open Prisma Studio
npm run db:seed        # Run database seed script
```

### Database Models
- **User:** Handles authentication, subscription, and usage tracking
- **Course:** AI-generated course content and metadata
- **Video:** AI-generated video scripts and metadata
- **Quiz:** AI-generated quiz questions and metadata

## Authentication

- Use NextAuth.js for authentication
- Credentials provider for email/password authentication
- Store hashed passwords using bcryptjs
- JWT-based session management
- Admin role: 'admin', Regular users: 'user'
- Default admin credentials in ADMIN_SETUP.md

## API Development

### Route Handlers
- Place API routes in `app/api/` directory
- Use Next.js Route Handler conventions
- Return proper HTTP status codes
- Handle errors gracefully with try-catch blocks
- Validate user authentication and authorization

### Example API Route Structure
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Implementation
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error message' },
      { status: 500 }
    );
  }
}
```

## Styling Guidelines

### Tailwind CSS
- Use Tailwind utility classes for styling
- Follow mobile-first responsive design
- Use custom color scheme defined in globals.css:
  - Primary: Blue/Cyan palette from primary-50 (#f0f9ff) through primary-900 (#0c4a6e), with primary-600 (#0284c7) as the main action color
  - Accent: Purple/Magenta palette, commonly using shades like #d946ef and #701a75 for emphasis
- Leverage Tailwind's gradient utilities for backgrounds
- Use consistent spacing with Tailwind's spacing scale

### Component Styling Patterns
- Apply hover states for interactive elements
- Use transition utilities for smooth animations
- Implement responsive breakpoints (sm, md, lg, xl)
- Maintain consistent shadow and border radius across components

## Development Workflow

### Commands
```bash
npm install           # Install dependencies
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production (includes Prisma generate)
npm start            # Start production server
npm run lint         # Run ESLint
```

### Development Process
1. Create feature branches following pattern: `feature/*` or task-specific naming
2. Make incremental, focused changes
3. Test changes locally before committing
4. Ensure build passes: `npm run build`
5. Run linter: `npm run lint`
6. Commit with clear, descriptive messages

### Environment Variables
Required environment variables (see `.env.example`):
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: NextAuth.js secret
- `NEXTAUTH_URL`: Application URL
- `OPENAI_API_KEY`: OpenAI API key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret

## AI Integration

### OpenAI Usage
- Use OpenAI API for generating courses, videos, and quizzes
- Implement proper error handling for API calls
- Consider rate limits and token usage
- Store generated content in database for future reference

### AI Generation Patterns
- Course generation: Create structured JSON with modules and lessons
- Video generation: Generate scripts with timing and visual descriptions
- Quiz generation: Create questions with multiple choice answers and explanations

## Payment Integration (Stripe)

### Subscription Tiers
- **Starter:** $19/month - 5 courses, 10 videos, unlimited quizzes
- **Professional:** $49/month - 25 courses, 50 videos, team features
- **Enterprise:** $149/month - Unlimited, custom integrations

### Usage Tracking
- Track monthly usage: courses, videos, quizzes
- Reset counters at subscription period start
- Enforce limits based on subscription tier
- Handle subscription status changes via webhooks

## Testing

Currently no automated tests are implemented. When adding tests:
- Use Jest for unit tests
- Use React Testing Library for component tests
- Place test files adjacent to source files with `.test.ts` or `.test.tsx` extension
- Follow existing testing patterns in the repository

## Documentation

### Key Documentation Files
- `README.md`: Quick start and project overview
- `PROJECT_OVERVIEW.md`: Detailed architecture and features
- `DEPLOYMENT.md`: General deployment instructions
- `VERCEL_DEPLOYMENT.md`: Vercel-specific deployment
- `ADMIN_SETUP.md`: Admin user management
- `AUTH_IMPLEMENTATION.md`: Authentication setup details
- `DATABASE_IMPLEMENTATION.md`: Database schema information
- `OPENAI_IMPLEMENTATION.md`: AI integration details
- `STRIPE_IMPLEMENTATION.md`: Payment processing setup

### When to Update Documentation
- Add documentation for new features
- Update relevant docs when changing architecture
- Keep deployment guides current
- Document environment variable changes

## Security Best Practices

- Never commit secrets or API keys to the repository
- Use environment variables for sensitive data
- Validate and sanitize all user inputs
- Implement proper authentication checks on API routes
- Use HTTPS in production
- Keep dependencies updated regularly
- Follow OWASP security guidelines

## Performance Considerations

- Use Next.js Image component for optimized images
- Implement proper caching strategies
- Minimize client-side JavaScript with Server Components
- Use dynamic imports for code splitting
- Optimize database queries with proper indexing
- Monitor bundle size and performance metrics

## Common Patterns

### Error Handling
```typescript
try {
  // Operation
} catch (error) {
  console.error('Descriptive error message:', error);
  // Handle error appropriately
}
```

### Type Safety
- Define interfaces for all data structures
- Use TypeScript's type inference when possible
- Avoid using `any` type
- Use proper typing for API responses

### Async Operations
- Use async/await for asynchronous operations
- Handle promise rejections properly
- Consider loading states in UI components

## Deployment

### Vercel (Recommended)
- Automatic deployments on push
- Configure environment variables in Vercel dashboard
- See VERCEL_DEPLOYMENT.md for detailed instructions

### Build Requirements
- Prisma Client generation runs automatically during build
- Ensure DATABASE_URL is set for build-time Prisma operations
- Production builds include optimization and minification

## References

For detailed information on specific topics, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

## Notes for Copilot

- When generating new components, follow the established patterns in existing components
- Match the code style of surrounding files
- Consider mobile responsiveness for all UI changes
- Use Lucide React icons consistently throughout the application
- Reference PROJECT_OVERVIEW.md for understanding the application architecture
- Check relevant implementation docs before making changes to auth, database, or integrations
