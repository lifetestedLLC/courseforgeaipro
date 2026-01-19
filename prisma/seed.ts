/**
 * Seed script for creating an admin user
 * Run with: npm run db:seed
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { getDirectDatabaseUrl } from '../lib/db-config';
import { TEMPLATE_CONFIGS } from '../lib/templates';

// Get the direct PostgreSQL connection URL from environment
const directDbUrl = getDirectDatabaseUrl();

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

  // Seed templates
  console.log('\nSeeding templates...');
  
  // Check if templates already exist
  const existingTemplatesCount = await prisma.template.count();
  
  if (existingTemplatesCount > 0) {
    console.log(`Templates already seeded (${existingTemplatesCount} templates exist)`);
  } else {
    // Create templates from configuration
    for (const templateConfig of TEMPLATE_CONFIGS) {
      await prisma.template.create({
        data: {
          name: templateConfig.name,
          description: templateConfig.description,
          category: templateConfig.category,
          tier: templateConfig.tier,
          thumbnail: templateConfig.thumbnail,
          fonts: templateConfig.fonts as any,
          colors: templateConfig.colors as any,
          clipArt: templateConfig.clipArt as any,
          layout: templateConfig.layout as any,
          isActive: true,
        },
      });
    }
    console.log(`✅ ${TEMPLATE_CONFIGS.length} templates seeded successfully!`);
  }
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
