/**
 * Database utility script to ensure admin users have the correct role
 * This script can be used to diagnose and fix admin user issues
 * 
 * Usage:
 *   npx tsx scripts/fix-admin-role.ts <email>
 * 
 * Example:
 *   npx tsx scripts/fix-admin-role.ts admin@courseforgeai.org
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getDirectDatabaseUrl } from '../lib/db-config';

const directDbUrl = getDirectDatabaseUrl();
const pool = new Pool({ connectionString: directDbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function fixAdminRole() {
  try {
    const email = process.argv[2];
    
    if (!email) {
      console.log('Usage: npx tsx scripts/fix-admin-role.ts <email>');
      console.log('Example: npx tsx scripts/fix-admin-role.ts admin@courseforgeai.org');
      process.exit(1);
    }

    console.log(`\n=== Checking user: ${email} ===\n`);
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true,
      }
    });

    if (!user) {
      console.log(`❌ User not found: ${email}`);
      console.log('Available users:');
      const allUsers = await prisma.user.findMany({
        select: { email: true, role: true }
      });
      allUsers.forEach(u => console.log(`   - ${u.email} (role: ${u.role})`));
      await cleanup();
      process.exit(1);
    }

    console.log('Current user data:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name || 'Not set'}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Subscription Tier: ${user.subscriptionTier || 'NULL'}`);
    console.log(`   Subscription Status: ${user.subscriptionStatus || 'NULL'}\n`);

    if (user.role === 'admin') {
      console.log('✅ User already has admin role - no changes needed');
      console.log('\nEffective tier for this user will be: "enterprise"');
      console.log('Admin users automatically get enterprise-level access to all features.');
    } else {
      console.log(`⚠️  User role is "${user.role}", not "admin"`);
      console.log('\nDo you want to update this user to admin role? (yes/no)');
      console.log('Note: Admins get enterprise-level access to all features.');
      
      // For automated scripts, we can check environment variable
      const autoFix = process.env.AUTO_FIX === 'true';
      
      if (autoFix) {
        await updateToAdmin(user.id, email);
      } else {
        console.log('\nTo automatically fix, run:');
        console.log(`   AUTO_FIX=true npx tsx scripts/fix-admin-role.ts ${email}`);
      }
    }

    await cleanup();
  } catch (error) {
    console.error('Error:', error);
    await cleanup();
    process.exit(1);
  }
}

async function updateToAdmin(userId: string, email: string) {
  console.log(`\nUpdating user to admin role...`);
  
  await prisma.user.update({
    where: { id: userId },
    data: { role: 'admin' }
  });
  
  console.log('✅ User role updated to "admin"');
  console.log(`\n${email} now has admin privileges with enterprise-level access.`);
}

async function cleanup() {
  await prisma.$disconnect();
  await pool.end();
}

fixAdminRole();
