# Step-by-Step Fix for Authentication on Your Domain

## What's Wrong
Your authentication works on localhost but not on your production domain (like courseforgeai.org). This is because an environment variable needs to be updated.

## Step-by-Step Instructions

### Option 1: If You're Using Vercel (Most Common)

#### Step 1: Open Your Vercel Dashboard
1. Go to https://vercel.com
2. Log in to your account
3. Find your project (should be named something like "courseforgeaipro" or similar)
4. Click on the project name

#### Step 2: Go to Environment Variables
1. Once in your project, look at the top navigation tabs
2. Click on "Settings"
3. In the left sidebar, click on "Environment Variables"

#### Step 3: Find and Update NEXTAUTH_URL
1. Scroll through the list and find `NEXTAUTH_URL`
2. Click the three dots (...) next to it
3. Click "Edit"
4. Change the value from:
   ```
   http://localhost:3000
   ```
   To your actual domain (with https://):
   ```
   https://courseforgeai.org
   ```
   (Replace `courseforgeai.org` with YOUR actual domain)
5. Click "Save"

#### Step 4: Redeploy
1. Go back to the "Deployments" tab at the top
2. Find the latest deployment (at the top of the list)
3. Click the three dots (...) next to it
4. Click "Redeploy"
5. Confirm by clicking "Redeploy" again
6. Wait for the deployment to complete (usually takes 1-2 minutes)

#### Step 5: Test It
1. Open your domain in a browser (e.g., https://courseforgeai.org)
2. Click "Sign Up" or go to `/register`
3. Create a test account
4. Log in with your new account
5. You should now successfully log in! 🎉

---

### Option 2: If You're Using Netlify

#### Step 1: Open Your Netlify Dashboard
1. Go to https://app.netlify.com
2. Log in to your account
3. Click on your site

#### Step 2: Go to Environment Variables
1. Click on "Site settings"
2. In the left sidebar, click on "Environment variables"
3. Or scroll down to "Environment variables" section

#### Step 3: Find and Update NEXTAUTH_URL
1. Find `NEXTAUTH_URL` in the list
2. Click "Edit" or the pencil icon
3. Change the value from:
   ```
   http://localhost:3000
   ```
   To your actual domain:
   ```
   https://your-domain.netlify.app
   ```
   (Or your custom domain if you set one up)
4. Click "Save"

#### Step 4: Trigger a Deploy
1. Go to the "Deploys" tab
2. Click "Trigger deploy" button
3. Select "Deploy site"
4. Wait for deployment to complete

#### Step 5: Test It
1. Open your domain
2. Try creating an account and logging in
3. Should work now! 🎉

---

### Option 3: If You're Using Another Platform (Railway, Render, etc.)

#### General Steps:
1. Log in to your hosting platform
2. Find your project/application
3. Look for "Environment Variables" or "Settings"
4. Find the `NEXTAUTH_URL` variable
5. Update it from `http://localhost:3000` to `https://your-actual-domain.com`
6. Save the changes
7. Redeploy or restart your application
8. Test the login

---

## What is Your Domain?

Not sure what to put for `NEXTAUTH_URL`? It's the URL people use to visit your site:

- If you're using Vercel's default: `https://your-project.vercel.app`
- If you have a custom domain: `https://yourdomain.com` (like `https://courseforgeai.org`)
- Always use `https://` (not `http://`)
- Don't add a trailing slash

Examples:
- ✅ `https://courseforgeai.org`
- ✅ `https://my-project.vercel.app`
- ❌ `http://courseforgeai.org` (should be https)
- ❌ `https://courseforgeai.org/` (no trailing slash)
- ❌ `http://localhost:3000` (that's only for development)

---

## Still Having Issues?

### Check if it worked:
1. Open your browser's Developer Tools (press F12)
2. Go to Application tab > Cookies
3. Visit your domain
4. Try to log in
5. After login, check if a cookie named `__Secure-next-auth.session-token` appears

### If you see an error:
1. Check the browser console (F12 > Console tab) for error messages
2. Make sure `NEXTAUTH_URL` exactly matches your domain
3. Make sure your domain uses HTTPS (not HTTP)
4. Try clearing your browser cookies and cache

### Common mistakes:
- Using `http://` instead of `https://`
- Forgetting to redeploy after changing the variable
- Using `localhost` instead of your actual domain
- Adding a trailing slash at the end

---

## Need More Help?

If you're still stuck, please tell me:
1. Which hosting platform are you using? (Vercel, Netlify, etc.)
2. What is your domain name?
3. Did you find the `NEXTAUTH_URL` variable?
4. What error message do you see when trying to log in?

I can give you more specific instructions! 😊
