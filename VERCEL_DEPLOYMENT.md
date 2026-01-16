# Vercel Deployment Guide

## Important Configuration for Vercel

### Environment Variables Required

Add these environment variables in your Vercel project settings:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Authentication (Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_generated_secret_here
# IMPORTANT: Use your actual production domain with https://
# Example: https://courseforgeai.org or https://www.courseforgeai.org
# DO NOT use http:// or localhost in production
NEXTAUTH_URL=https://your-domain.vercel.app

# OpenAI API (Optional - for AI features)
OPENAI_API_KEY=your_openai_api_key

# Stripe (Optional - for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_STARTER_PRICE_ID=price_starter_id
STRIPE_PROFESSIONAL_PRICE_ID=price_professional_id
STRIPE_ENTERPRISE_PRICE_ID=price_enterprise_id
```

### Build Settings

Vercel should automatically detect these settings, but verify:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Database Setup

1. Set up a PostgreSQL database (recommend: Vercel Postgres, Supabase, or Neon)
2. Add the `DATABASE_URL` to Vercel environment variables
3. Run migrations after deployment:
   ```bash
   npx prisma db push
   ```

### Admin User Setup

After successful deployment:

1. Connect to your production database
2. Run the seed script to create an admin user:
   ```bash
   npm run db:seed
   ```
   
   Or manually create an admin user through your database interface.

**Default Admin Credentials** (from seed script):
- Email: `admin@courseforgeai.org`
- Password: `Admin123!`
- **⚠️ IMPORTANT**: Change the password immediately after first login!

### Post-Deployment Steps

1. **Verify build success**: Check Vercel deployment logs
2. **Test authentication**: Try logging in with admin credentials
3. **Check server logs**: Monitor the Functions logs in Vercel dashboard
4. **Set up custom domain**: Add your domain in Vercel project settings
5. **Enable monitoring**: Consider adding Vercel Analytics and Error Monitoring

### Common Issues

#### Build Failures

- **Issue**: "Cannot destructure property 'data' of 'useSession()'"
  - **Solution**: Ensure dynamic pages using `useSession()` have `export const dynamic = 'force-dynamic';`

- **Issue**: "Prisma client not generated"
  - **Solution**: The build command includes `prisma generate`, but verify it's running

#### Database Connection Issues

- **Issue**: "Can't reach database server"
  - **Solution**: Check DATABASE_URL format and network settings
  - Ensure your database allows connections from Vercel's IP ranges

#### Authentication Issues

- **Issue**: NextAuth errors
  - **Solution**: Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set correctly
  - `NEXTAUTH_URL` should match your production domain

### Server Logs

Server logs are now properly structured and can be viewed in:
- **Vercel Dashboard**: Functions → Your function → Logs
- **Format**: `[timestamp] [LEVEL] message | context`

Log levels:
- `INFO`: Normal operations (login, registration, etc.)
- `WARN`: Warning conditions (failed login attempts, etc.)
- `ERROR`: Error conditions with stack traces
- `DEBUG`: Debug information (only in development)

### Monitoring Best Practices

1. **Check logs regularly** for authentication issues
2. **Monitor API routes** for performance issues
3. **Track error rates** in Vercel dashboard
4. **Set up alerts** for critical errors

### Support

For deployment issues:
- Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- Check [Vercel Documentation](https://vercel.com/docs)
- Review server logs in Vercel dashboard
