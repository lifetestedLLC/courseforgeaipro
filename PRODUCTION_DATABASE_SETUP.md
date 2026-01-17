# Production Database Setup Guide

## The Problem You're Experiencing

You're seeing this error on your production site (https://www.courseforgeai.org):
```
Invalid `prisma.user.findUnique()` invocation: Can't reach database server at 127.0.0.1:51214
```

**Why this happens:**
- Your local development (localhost:3000) works because it uses a local Prisma dev database
- Your production site fails because it's trying to connect to `127.0.0.1:51214` (a local address that doesn't exist in production)
- The `DATABASE_URL` environment variable in Vercel is either not set or incorrectly set to a local development URL

## Solution Overview

You need to:
1. Set up a production PostgreSQL database
2. Configure the `DATABASE_URL` in Vercel with a production connection string
3. Run database migrations in production

---

## Step 1: Choose a Production Database Provider

You need a PostgreSQL database that's accessible from the internet. Here are the recommended options:

### Option A: Vercel Postgres (Easiest - Recommended)

**Pros:** 
- Seamlessly integrates with Vercel
- Automatic setup
- Free tier available

**Steps:**
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your CourseForge AI project
3. Click on the **"Storage"** tab
4. Click **"Create Database"**
5. Select **"Postgres"**
6. Choose a name (e.g., "courseforge-db")
7. Select a region close to your users
8. Click **"Create"**
9. Vercel will automatically add the `DATABASE_URL` environment variable to your project
10. **Important:** Vercel Postgres requires a different connection string format. After creation, go to your database settings and copy the **"Postgres URL"** (not Prisma URL)
11. Skip to Step 3 below

### Option B: Supabase (Good Alternative)

**Pros:**
- Free tier with 500MB database
- Easy to use
- Good documentation

**Steps:**
1. Go to https://supabase.com
2. Create a free account
3. Click **"New Project"**
4. Fill in:
   - Name: courseforge-db
   - Database Password: (create a strong password and save it!)
   - Region: (choose closest to your users)
5. Wait for the project to be created (takes 2-3 minutes)
6. Once ready, go to **Settings** → **Database**
7. Scroll down to **"Connection string"**
8. Copy the **"URI"** connection string
9. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
10. Replace `[YOUR-PASSWORD]` with the password you created in step 4
11. Continue to Step 2 below

### Option C: Neon (Another Good Option)

**Pros:**
- Serverless PostgreSQL
- Free tier available
- Fast setup

**Steps:**
1. Go to https://neon.tech
2. Create a free account
3. Click **"Create a project"**
4. Name it "courseforge-db"
5. Select a region
6. Click **"Create project"**
7. On the dashboard, you'll see a **"Connection string"**
8. Copy the connection string (it starts with `postgresql://`)
9. Continue to Step 2 below

---

## Step 2: Add DATABASE_URL to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your CourseForge AI project
3. Click **"Settings"** at the top
4. Click **"Environment Variables"** in the left sidebar
5. Look for `DATABASE_URL`:
   - **If it exists:** Click the three dots (...) → **"Edit"**
   - **If it doesn't exist:** Click **"Add New"**
6. Set the values:
   - **Name:** `DATABASE_URL`
   - **Value:** Paste the connection string you copied from your database provider
   - **Environments:** Check **Production**, **Preview**, and **Development**
7. Click **"Save"**

**Important:** The connection string should look like:
```
postgresql://username:password@host:5432/database?sslmode=require
```

**NOT like:**
```
prisma+postgres://localhost:51213/?api_key=...
```

The `prisma+postgres://` format is ONLY for local development with `npx prisma dev`. Production requires a real `postgresql://` connection string.

---

## Step 3: Set Up the Database Schema

Now you need to create the database tables in your production database.

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI if you haven't:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Link your project:
   ```bash
   cd /path/to/your/courseforgeaipro
   vercel link
   ```

4. Pull the environment variables:
   ```bash
   vercel env pull .env.production
   ```

5. Run the migrations:
   ```bash
   DATABASE_URL=$(cat .env.production | grep DATABASE_URL | cut -d '=' -f2-) npx prisma db push
   ```

6. Seed the database with an admin user:
   ```bash
   DATABASE_URL=$(cat .env.production | grep DATABASE_URL | cut -d '=' -f2-) npm run db:seed
   ```

### Option B: Using Database GUI (Alternative)

If the CLI method doesn't work, you can run SQL directly:

1. Connect to your database using the provider's web interface:
   - **Vercel Postgres:** In your Vercel dashboard → Storage → Your database → "Query"
   - **Supabase:** Go to your project → SQL Editor
   - **Neon:** Go to your project → SQL Editor

2. Generate the SQL schema:
   ```bash
   npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > setup.sql
   ```

3. Copy the contents of `setup.sql` and run it in your database's SQL editor

4. Create an admin user manually with SQL:
   ```sql
   INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt", "usageResetDate")
   VALUES (
     'admin-' || gen_random_uuid()::text,
     'admin@courseforgeai.org',
     'Admin User',
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIr.vmXQW2', -- Password: Admin123!
     'admin',
     NOW(),
     NOW(),
     NOW()
   );
   ```

---

## Step 4: Redeploy Your Application

1. Go to your Vercel dashboard
2. Click on the **"Deployments"** tab
3. Find the most recent deployment
4. Click the three dots (...) on the right
5. Click **"Redeploy"**
6. Confirm by clicking **"Redeploy"** again
7. Wait 1-2 minutes for the deployment to complete

---

## Step 5: Test Your Production Site

1. Open https://www.courseforgeai.org in a new browser tab (or incognito mode)
2. Go to the sign-up page: https://www.courseforgeai.org/register
3. Create a test account:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPassword123!
4. Click "Sign Up"
5. You should be redirected to the login page
6. Login with your test credentials
7. You should see the dashboard! 🎉

### Test Admin Access

1. Go to https://www.courseforgeai.org/login
2. Login with:
   - Email: `admin@courseforgeai.org`
   - Password: `Admin123!`
3. After logging in, go to: https://www.courseforgeai.org/admin
4. You should see the admin dashboard

---

## Troubleshooting

### "Still getting database connection error"

**Check your DATABASE_URL in Vercel:**
1. Go to Settings → Environment Variables
2. Click "Edit" on DATABASE_URL
3. Make sure it looks like: `postgresql://...` (not `prisma+postgres://...`)
4. Make sure it doesn't contain `localhost` or `127.0.0.1`
5. Save and redeploy

**Verify the connection string works:**
1. Install `psql` (PostgreSQL client) if you have it
2. Test the connection:
   ```bash
   psql "your-connection-string-here"
   ```
3. If it connects, the string is valid

### "Tables don't exist"

You need to run migrations (see Step 3 above). The database is connected but empty.

### "Admin user not found"

Run the seed script (see Step 3 above) or create the admin user manually with SQL.

### "Environment variable not found"

Make sure you:
1. Saved the DATABASE_URL in Vercel
2. Checked all three environments (Production, Preview, Development)
3. Redeployed after saving

### "Connection timeout"

Your database might have firewall rules. Check:
- **Supabase:** Should work by default
- **Neon:** Should work by default
- **Vercel Postgres:** Should work by default
- **Custom database:** Make sure it allows connections from any IP (0.0.0.0/0) or specifically from Vercel's IP ranges

---

## Understanding the Difference

### Local Development
- Uses: `prisma+postgres://localhost:51213/?api_key=...`
- Started with: `npx prisma dev`
- Stored in: `.env` file (not committed to git)
- Works on: Your computer only

### Production
- Uses: `postgresql://user:pass@host:5432/db`
- Provided by: Vercel Postgres, Supabase, Neon, etc.
- Stored in: Vercel environment variables
- Works on: Your live website

**You cannot use a local development URL in production!** The `127.0.0.1:51214` address only exists on your local machine.

---

## Quick Reference

### Required Environment Variables in Vercel

Make sure ALL of these are set:

1. ✅ `DATABASE_URL` - Your production PostgreSQL connection string
2. ✅ `NEXTAUTH_SECRET` - Random secret for NextAuth (generate with: `openssl rand -base64 32`)
3. ✅ `NEXTAUTH_URL` - Your production domain: `https://courseforgeai.org` or `https://www.courseforgeai.org`

Optional (for features):
4. ⚠️ `OPENAI_API_KEY` - For AI course generation
5. ⚠️ `STRIPE_SECRET_KEY` - For payment processing

---

## Need More Help?

If you've followed all these steps and it's still not working:

1. Check the Vercel deployment logs:
   - Go to Deployments → Latest deployment → "View Function Logs"
   - Look for any error messages

2. Verify your environment variables:
   - Go to Settings → Environment Variables
   - Make sure DATABASE_URL, NEXTAUTH_SECRET, and NEXTAUTH_URL are all set correctly

3. Test the database connection:
   - Use the SQL editor in your database provider's dashboard
   - Try running: `SELECT 1;` to verify the database is accessible

4. Check for typos:
   - Make sure there are no extra spaces in your connection string
   - Verify the password is correct (no special characters that need escaping)

5. Contact your database provider's support:
   - They can verify the connection string is correct
   - They can check if there are any access restrictions

---

## Summary

The key to fixing your issue:
1. **Create a production PostgreSQL database** (Vercel Postgres, Supabase, or Neon)
2. **Copy the connection string** (starts with `postgresql://`)
3. **Add it to Vercel** environment variables as `DATABASE_URL`
4. **Run migrations** to create tables
5. **Redeploy** your application

After this, both sign-up and admin login will work on https://www.courseforgeai.org! 🚀
