# Vercel Setup Instructions for courseforgeai.org

## 🚨 Important: Database Setup Required!

If you're seeing database connection errors like:
- `Can't reach database server at 127.0.0.1:51214`
- `Invalid prisma.user.findUnique() invocation`

**You need to set up a production database first!**

👉 **Follow this guide first:** [PRODUCTION_DATABASE_SETUP.md](./PRODUCTION_DATABASE_SETUP.md)

The steps below cover authentication setup (NEXTAUTH_URL), but you **also need a production database** for the site to work. Both are required!

---

## Your Specific Setup
- **Platform**: Vercel
- **Domain**: courseforgeai.org
- **What needs to change**: 
  1. DATABASE_URL environment variable (see [PRODUCTION_DATABASE_SETUP.md](./PRODUCTION_DATABASE_SETUP.md))
  2. NEXTAUTH_URL environment variable (instructions below)

---

## Exact Steps to Fix Your Authentication

### Step 1: Log in to Vercel
1. Go to https://vercel.com
2. Log in to your account
3. You should see your projects dashboard

### Step 2: Open Your CourseForge AI Project
1. Look for your project (probably named "courseforgeaipro" or similar)
2. Click on the project card to open it

### Step 3: Navigate to Environment Variables
1. At the top of the page, you'll see tabs: Overview, Deployments, Analytics, Settings, etc.
2. Click on **"Settings"**
3. In the left sidebar menu, click on **"Environment Variables"**

### Step 4: Update NEXTAUTH_URL
1. Scroll through the list of environment variables
2. Find the one named **`NEXTAUTH_URL`**
3. Click the **three dots (...)** on the right side of that variable
4. Click **"Edit"**
5. You'll see the current value is probably: `http://localhost:3000`
6. **Change it to**: `https://courseforgeai.org`
7. Make sure you:
   - Use `https://` (not `http://`)
   - Don't add `www.` (unless that's how people access your site)
   - Don't add a trailing slash at the end
8. Click **"Save"**

### Step 5: Redeploy Your Site
1. Click on the **"Deployments"** tab at the top
2. You'll see a list of your deployments
3. Find the most recent one (at the top)
4. Click the **three dots (...)** on the right side
5. Click **"Redeploy"**
6. A popup will appear - click **"Redeploy"** again to confirm
7. Wait 1-2 minutes for the deployment to complete
8. You'll see "Building..." then "Ready" when it's done

### Step 6: Test Your Login
1. Open a new browser window (or use incognito mode)
2. Go to https://courseforgeai.org
3. Click on "Sign Up" or go to https://courseforgeai.org/register
4. Create a test account with:
   - Name: Test User
   - Email: test@example.com (or any email)
   - Password: TestPassword123!
5. After creating the account, you'll be redirected to the login page
6. Log in with the email and password you just created
7. You should now be logged in and see the dashboard! 🎉

---

## Visual Guide (What to Look For)

### In Vercel Settings > Environment Variables:
```
Name: NEXTAUTH_URL
Value: https://courseforgeai.org    ← Change to this
Production: ✓
Preview: ✓ 
Development: (leave as is)
```

---

## If You Also Use www.courseforgeai.org

If people access your site with `www.courseforgeai.org`, you have two options:

**Option 1: Set NEXTAUTH_URL to www version**
```
NEXTAUTH_URL=https://www.courseforgeai.org
```

**Option 2: Set up a redirect in Vercel**
1. In Vercel Settings, find "Domains"
2. Make sure both `courseforgeai.org` and `www.courseforgeai.org` are listed
3. Set one as primary (usually the non-www version)
4. Vercel will automatically redirect the other to the primary

I recommend using `https://courseforgeai.org` (without www) as your NEXTAUTH_URL.

---

## Troubleshooting

### Still not working after redeploying?

1. **Clear your browser cache and cookies**:
   - Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
   - Select "Cookies" and "Cached images and files"
   - Choose "All time"
   - Click "Clear data"

2. **Try in incognito/private mode**:
   - This rules out any cached data issues

3. **Check the cookie is being set**:
   - Press F12 to open Developer Tools
   - Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
   - Click "Cookies" in the left sidebar
   - Click on your domain (https://courseforgeai.org)
   - After logging in, you should see a cookie named `__Secure-next-auth.session-token`
   - If you don't see this cookie, there might be another issue

4. **Verify the environment variable was saved**:
   - Go back to Vercel Settings > Environment Variables
   - Check that NEXTAUTH_URL shows `https://courseforgeai.org`
   - Make sure the checkboxes for Production and Preview are checked

5. **Check the deployment logs**:
   - Go to Deployments tab
   - Click on the latest deployment
   - Click "View Function Logs" or "View Build Logs"
   - Look for any errors related to authentication or NEXTAUTH

### Common Error Messages

**"Invalid credentials" even with correct password**:
- This is usually a database issue
- Check that your DATABASE_URL is set correctly in Vercel
- Make sure it's a production database URL (format: `postgresql://...`), not a local one
- See [PRODUCTION_DATABASE_SETUP.md](./PRODUCTION_DATABASE_SETUP.md) for help

**"Session expired" immediately after login**:
- Make sure NEXTAUTH_SECRET is also set in Vercel
- Verify your domain uses HTTPS (it should automatically with Vercel)

**Redirect loop (keeps redirecting to login)**:
- Double-check NEXTAUTH_URL matches your exact domain
- Make sure there are no typos

---

## All Your Required Environment Variables

While you're in the Environment Variables section, make sure you have ALL of these set:

1. ✅ **DATABASE_URL** = Your production PostgreSQL connection string (format: `postgresql://user:password@host:5432/database`)
   - **NOT** a local URL like `prisma+postgres://localhost:...`
   - See [PRODUCTION_DATABASE_SETUP.md](./PRODUCTION_DATABASE_SETUP.md) for detailed setup
2. ✅ **NEXTAUTH_URL** = `https://courseforgeai.org` or `https://www.courseforgeai.org`
3. ✅ **NEXTAUTH_SECRET** = (a long random string - should already be set)
4. ⚠️ **OPENAI_API_KEY** = (optional, for AI features)
5. ⚠️ **STRIPE_SECRET_KEY** = (optional, for payments)

**If you don't have DATABASE_URL set correctly, nothing will work!** This is the most common cause of issues.

---

## Summary

**What you're doing**: Telling NextAuth that your production site is at `https://courseforgeai.org` instead of `http://localhost:3000`

**Why it matters**: Cookies work differently on localhost vs a real domain, especially with HTTPS. Without this setting, the authentication cookie doesn't get set properly.

**What happens after**: Once you update NEXTAUTH_URL and redeploy, the authentication system will properly set secure cookies for your domain, and login will work!

---

## Need More Help?

If you've followed all these steps and it's still not working, please let me know:
1. Did you find the NEXTAUTH_URL variable in Vercel?
2. Did the redeploy complete successfully?
3. What error message do you see when trying to log in?
4. Can you see the `__Secure-next-auth.session-token` cookie in your browser's Developer Tools?

I'll help you debug further! 😊
