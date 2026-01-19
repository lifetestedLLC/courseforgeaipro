# CourseForge AI Pro

AI-powered course creation platform for educators and content creators.

## 🚨 Production Deployment Issue?

If your production site shows database connection errors, see:
- **[Quick Fix Guide](./QUICK_FIX_PRODUCTION_DATABASE.md)** - ⚡ Fast 5-minute fix
- **[Detailed Setup Guide](./PRODUCTION_DATABASE_SETUP.md)** - 📖 Comprehensive instructions

## Features

- 🎓 **AI Course Generation** - Create comprehensive course outlines and content
- 🎥 **AI Video Creation** - Generate professional videos with AI
- 📝 **Interactive Quizzes** - Build assessments automatically
- 🎨 **Design Templates** - 14 professionally designed templates with custom fonts and clip art for beautiful PDF exports
- 🔗 **Platform Integrations** - Export to Coursera, Udemy, Teachable, and more
- 📊 **Creator Dashboard** - Manage all your courses in one place
- 💰 **Subscription Tiers** - Free, Starter ($19), Professional ($49), and Enterprise ($99) plans with increasing template access

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

- **[Quick Fix: Production Database](./QUICK_FIX_PRODUCTION_DATABASE.md)** - ⚡ 5-minute production database fix
- **[Getting Started Guide](./GETTING_STARTED.md)** - ⭐ Start here for local development setup
- **[Production Database Setup](./PRODUCTION_DATABASE_SETUP.md)** - 🚀 Required for production deployment
- **[Templates Documentation](./TEMPLATES_DOCUMENTATION.md)** - 🎨 Course design templates guide
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - 🔧 Solutions for common issues
- [Deployment Guide](./DEPLOYMENT.md) - General deployment options
- [Vercel Deployment](./VERCEL_DEPLOYMENT.md) - Vercel-specific setup
- [Vercel CourseForge Setup](./VERCEL_COURSEFORGEAI_SETUP.md) - Domain-specific setup for courseforgeai.org
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
