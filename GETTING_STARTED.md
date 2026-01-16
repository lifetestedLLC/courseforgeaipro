# Getting Started with CourseForge AI Pro

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Database

The application uses Prisma Postgres for local development. Start the database server:

```bash
npx prisma dev
```

This will:
- Start a local PostgreSQL server
- Display the database connection URL that you need to copy
- Keep running in the background (leave this terminal open)

**IMPORTANT:** After running `npx prisma dev`, you will see output like:
```
[log] prisma+postgres://localhost:51213/?api_key=...
```

Copy this ENTIRE URL and update your `.env` file:
1. Open `.env` in your text editor
2. Find the line starting with `DATABASE_URL=`
3. Replace the entire value with the URL from the `npx prisma dev` output
4. Save the file

Your ports (51213, 51214, etc.) may be different - that's normal! Just use the URL that `npx prisma dev` gives you.

### 3. Initialize the Database (First Time Only)

In a **new terminal window**, run:

```bash
# Push the database schema
npm run db:push

# Create the admin user
npm run db:seed
```

The admin user credentials are:
- **Email**: `admin@courseforgeai.org`
- **Password**: `Admin123!`

⚠️ **Important**: Change the admin password after first login!

### 4. Start the Application

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Testing the Application

### Test User Registration

1. Visit [http://localhost:3000](http://localhost:3000)
2. Click "Get Started" or "Start Free Trial"
3. Fill out the registration form at `/register`
4. After successful registration, you'll be redirected to `/login`
5. Log in with your credentials

### Test Admin Login

1. Visit [http://localhost:3000/login](http://localhost:3000/login)
2. Use the admin credentials:
   - Email: `admin@courseforgeai.org`
   - Password: `Admin123!`
3. You should be logged in and redirected to the dashboard

## Common Issues

### "Can't reach database server"

**Problem**: The application shows a Prisma error saying it can't reach the database.

**Most Common Cause**: The `DATABASE_URL` in your `.env` file doesn't match the actual ports that Prisma dev server is using.

**Solution**: 
1. Make sure the Prisma dev server is running:
   ```bash
   npx prisma dev
   ```
2. Copy the `DATABASE_URL` from the output (starts with `prisma+postgres://`)
3. Update your `.env` file with this URL
4. Restart your application with `npm run dev`

If you're still having issues:
- Stop the Prisma dev server (Ctrl+C)
- Remove old servers: `npx prisma dev rm`
- Start fresh: `npx prisma dev`
- Copy the new DATABASE_URL to your `.env`

### "Unknown file extension .ts" when seeding

**Problem**: The seed script fails with a TypeScript error.

**Solution**: This has been fixed. Make sure you have the latest dependencies:
```bash
npm install
npm run db:seed
```

### Admin user already exists

**Problem**: Running `npm run db:seed` shows "Admin user already exists"

**Solution**: This is normal if you've already created the admin user. You can:
- Use the existing admin credentials
- Delete the admin user in Prisma Studio and run the seed again
- Manually update the password in Prisma Studio if you forgot it

## Development Workflow

1. **Start the database** (in one terminal):
   ```bash
   npx prisma dev
   ```

2. **Start the app** (in another terminal):
   ```bash
   npm run dev
   ```

3. **View the database** (optional):
   ```bash
   npm run db:studio
   ```
   Opens Prisma Studio at [http://localhost:5555](http://localhost:5555)

## Stopping the Application

1. Press `Ctrl+C` in the terminal running `npm run dev`
2. Press `Ctrl+C` in the terminal running `npx prisma dev`

## Next Steps

- Read [ADMIN_SETUP.md](./ADMIN_SETUP.md) for admin user management
- Read [AUTH_IMPLEMENTATION.md](./AUTH_IMPLEMENTATION.md) for authentication details
- Read [DATABASE_IMPLEMENTATION.md](./DATABASE_IMPLEMENTATION.md) for database schema
- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- **If you encounter issues, check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** 🔧

## Production Deployment

For production deployment (e.g., to Vercel), you'll need to:

1. Set up a production PostgreSQL database (Vercel Postgres, Neon, etc.)
2. Update the `DATABASE_URL` environment variable
3. Run migrations: `npx prisma migrate deploy`
4. Deploy your application

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.
