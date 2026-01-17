# CourseForge AI Pro

AI-powered course creation platform for educators and content creators.

## Features

- 🎓 **AI Course Generation** - Create comprehensive course outlines and content
- 🎥 **AI Video Creation** - Generate professional videos with AI
- 📝 **Interactive Quizzes** - Build assessments automatically
- 🔗 **Platform Integrations** - Export to Coursera, Udemy, Teachable, and more
- 📊 **Creator Dashboard** - Manage all your courses in one place
- 💰 **Affordable Pricing** - Plans starting at $19/month with free trial

## Getting Started

For detailed setup instructions, see [GETTING_STARTED.md](./GETTING_STARTED.md)

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the database:**
   ```bash
   npx prisma dev
   ```
   **Important:** Copy the `DATABASE_URL` from the output and paste it into your `.env` file, replacing the existing `DATABASE_URL` value.
   
   (Keep this running in a separate terminal)

3. **Initialize the database** (first time only):
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start the application:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Deployment

**🚨 Deploying to production?** Make sure to set up a production database first!

See:
- **[Production Database Setup](./PRODUCTION_DATABASE_SETUP.md)** - 📖 Step-by-step guide for setting up production database
- **[Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)** - Complete Vercel deployment instructions

**Common Issue:** If sign-up or login doesn't work on your live site, you likely need to configure a production database. The local development database (`prisma+postgres://localhost:...`) won't work in production.

## Admin Setup

See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for instructions on creating and managing admin users.

Default admin credentials (change after first login):
- Email: `admin@courseforgeai.org`
- Password: `Admin123!`

## Documentation

- **[Getting Started Guide](./GETTING_STARTED.md)** - ⭐ Start here for local development setup
- **[Production Database Setup](./PRODUCTION_DATABASE_SETUP.md)** - 🚀 Required for production deployment
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - 🔧 Solutions for common issues
- [Deployment Guide](./DEPLOYMENT.md) - General deployment options
- [Vercel Deployment](./VERCEL_DEPLOYMENT.md) - Vercel-specific setup
- [Admin Setup](./ADMIN_SETUP.md) - Admin user management
- [Authentication](./AUTH_IMPLEMENTATION.md) - Authentication setup
- [Database](./DATABASE_IMPLEMENTATION.md) - Database schema and setup
- [OpenAI Integration](./OPENAI_IMPLEMENTATION.md) - AI features setup
- [Stripe Integration](./STRIPE_IMPLEMENTATION.md) - Payment processing
- [Project Overview](./PROJECT_OVERVIEW.md) - Architecture overview

## Domain

This project is configured for **courseforgeai.org**

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide Icons
- NextAuth.js (Authentication)
- Prisma (ORM)
- PostgreSQL (Database)
- Stripe (Payments)
- OpenAI (AI Features)

## License

All rights reserved.
