# Troubleshooting Guide

## 🚨 Production Deployment Issues

### Error: "Can't reach database server at 127.0.0.1" (on your live website)

If you see this error on your **production site** (e.g., www.courseforgeai.org):

**Cause**: You're trying to use a local development database in production.

**Solution**: You need a production PostgreSQL database.

👉 **Quick Fix**: See [QUICK_FIX_PRODUCTION_DATABASE.md](./QUICK_FIX_PRODUCTION_DATABASE.md)  
👉 **Detailed Guide**: See [PRODUCTION_DATABASE_SETUP.md](./PRODUCTION_DATABASE_SETUP.md)

**Key Point**: Local database URLs (`prisma+postgres://localhost:...`) only work on your computer, not on deployed sites. Production requires a real PostgreSQL database (Vercel Postgres, Supabase, or Neon).

---

## Local Development Issues

### Error: "Can't reach database server" or "ECONNREFUSED" (on localhost)

This happens when the application can't connect to your **local** database.

**Cause**: Your `DATABASE_URL` in the `.env` file doesn't match the ports where Prisma dev server is actually running.

**Solution Steps:**

1. **Stop your application** (Ctrl+C if it's running)

2. **Check if Prisma dev is running:**
   ```bash
   npx prisma dev ls
   ```

3. **If nothing is listed, start Prisma dev:**
   ```bash
   npx prisma dev
   ```
   
   You'll see output like:
   ```
   [log] prisma+postgres://localhost:51213/?api_key=eyJ...
   ```

4. **Copy the ENTIRE URL** from the output (everything starting with `prisma+postgres://`)

5. **Update your `.env` file:**
   - Open `.env` in your text editor
   - Find the line with `DATABASE_URL=`
   - Replace the entire value with the URL you just copied
   - Save the file

6. **Restart your application:**
   ```bash
   npm run dev
   ```

### Error: "DATABASE_URL environment variable is not set"

**Cause**: Your `.env` file is missing or the DATABASE_URL is empty.

**Solution:**

1. Make sure you have a `.env` file in the root of your project
2. Copy `.env.example` to `.env` if you don't have one:
   ```bash
   cp .env.example .env
   ```
3. Follow the steps above to set the DATABASE_URL

### Prisma dev server won't start

**Problem**: `npx prisma dev` fails or shows errors

**Solutions:**

1. **Remove old servers and start fresh:**
   ```bash
   npx prisma dev rm
   npx prisma dev
   ```

2. **Check if ports are already in use:**
   ```bash
   # On macOS/Linux
   lsof -i :51213
   
   # On Windows
   netstat -ano | findstr :51213
   ```
   
   If another process is using the ports, either stop that process or use different ports:
   ```bash
   npx prisma dev --port 51213 --db-port 51214 --shadow-db-port 51215
   ```

3. **Try a different server name:**
   ```bash
   npx prisma dev --name myproject
   ```

## Admin Login Issues

### Error: "Invalid credentials" for admin user

**Cause**: The admin user hasn't been created yet.

**Solution:**

1. **Make sure the database tables exist:**
   ```bash
   npm run db:push
   ```

2. **Create the admin user:**
   ```bash
   npm run db:seed
   ```

3. **Try logging in with the default credentials:**
   - Email: `admin@courseforgeai.org`
   - Password: `Admin123!`

### Admin user already exists but password doesn't work

**Solutions:**

1. **Delete and recreate the admin user:**
   ```bash
   npx prisma studio
   ```
   - Open the `User` table
   - Find the admin user (email: `admin@courseforgeai.org`)
   - Delete the record
   - Close Prisma Studio
   - Run: `npm run db:seed`

2. **Or manually set a new password:**
   - Generate a bcrypt hash of your desired password using an online tool
   - Use Prisma Studio to update the password field

## Database Schema Issues

### Error: "Unknown argument" or "Field doesn't exist"

**Cause**: Your database schema doesn't match the Prisma schema file.

**Solution:**

```bash
npm run db:push
```

This will update your database to match the schema.

### I made changes to schema.prisma but they're not reflected

**Solution:**

1. **Push changes to database:**
   ```bash
   npm run db:push
   ```

2. **Regenerate Prisma Client:**
   ```bash
   npm run db:generate
   ```

3. **Restart your application:**
   ```bash
   npm run dev
   ```

## Build and Deployment Issues

### Error during `npm run build`

**Cause**: Usually missing environment variables or database connection issues.

**Solution:**

1. **For local builds**, make sure Prisma dev is running and DATABASE_URL is set

2. **For production builds**, you need a real PostgreSQL database:
   - Set up a database on Vercel Postgres, Supabase, or Neon
   - Set DATABASE_URL to a regular PostgreSQL connection string:
     ```
     postgresql://user:password@host:5432/database
     ```

### Vercel deployment fails

**Most common issues:**

1. **Missing DATABASE_URL in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add DATABASE_URL with your production PostgreSQL connection string

2. **Missing NEXTAUTH_SECRET:**
   - Generate one: `openssl rand -base64 32`
   - Add it to Vercel environment variables

3. **Database tables not created:**
   - After deployment, run migrations:
     ```bash
     npx prisma db push
     ```

## Still Having Issues?

### Reset Everything

If nothing else works, reset your local development setup:

```bash
# Stop Prisma dev
# Press Ctrl+C in the terminal running prisma dev

# Remove all Prisma servers
npx prisma dev rm

# Remove node_modules (optional but recommended)
rm -rf node_modules package-lock.json

# Fresh install
npm install

# Start fresh
npx prisma dev
# Copy the DATABASE_URL to .env

# Initialize database
npm run db:push
npm run db:seed

# Start app
npm run dev
```

### Check the Logs

Look for specific error messages:

```bash
# Application logs
npm run dev
# Look for errors in the terminal

# Database logs
npx prisma studio
# Check if tables exist and have data
```

### Common Error Messages and What They Mean

| Error Message | What It Means | Solution |
|---------------|---------------|----------|
| `ECONNREFUSED` | Can't connect to database | Check DATABASE_URL and Prisma dev server |
| `DATABASE_URL environment variable is not set` | Missing .env file or empty DATABASE_URL | Create/update .env file |
| `Invalid credentials` | Wrong email/password or user doesn't exist | Run `npm run db:seed` |
| `P1012` | Invalid datasource configuration | Don't add `url` field to schema.prisma in Prisma v7 |
| `P2002` | Unique constraint violation | Email already exists, use different email |
| `P1001` | Can't reach database server | Start `npx prisma dev` and update DATABASE_URL |

### Get Help

1. Check the [README.md](./README.md) for basic setup
2. Review [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed steps
3. Check [ADMIN_SETUP.md](./ADMIN_SETUP.md) for admin user issues
4. Look at [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for deployment issues
