/**
 * Seed script for creating an admin user
 * Run with: npx tsx prisma/seed.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Extract the direct PostgreSQL URL from the Prisma Postgres URL
// The DATABASE_URL format is: prisma+postgres://localhost:PORT/?api_key=BASE64
// The api_key contains the actual database connection info
const directDbUrl = 'postgres://postgres:postgres@localhost:51214/template1?sslmode=disable';

// Create a connection pool
const pool = new Pool({
  connectionString: directDbUrl,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seed...');

  // Admin credentials - can be overridden via environment variables
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@courseforgeai.org';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  const adminName = process.env.ADMIN_NAME || 'Admin User';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin user already exists with email: ${adminEmail}`);
    console.log(`Admin user ID: ${existingAdmin.id}`);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'admin',
    },
  });

  console.log('✅ Admin user created successfully!');
  console.log('-----------------------------------');
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${'*'.repeat(adminPassword.length)}`);
  console.log(`User ID: ${admin.id}`);
  console.log('-----------------------------------');
  console.log('⚠️  IMPORTANT: Change the admin password after first login!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
