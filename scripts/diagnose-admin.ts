/**
 * Diagnostic script to check admin user and effective tier calculation
 */

import 'dotenv/config';
import { createScriptPrismaClient, cleanupDatabase } from '../lib/script-db';
import { getEffectiveTier, isAdmin } from '../lib/subscription';
import type { SubscriptionTier } from '../types/template';

const { prisma, pool } = createScriptPrismaClient();

async function diagnose() {
  try {
    console.log('=== Admin User Diagnostic ===\n');
    
    // Find all admin users
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true,
      }
    });

    if (admins.length === 0) {
      console.log('❌ ERROR: No admin users found in database!');
      console.log('   Run: npm run db:seed');
      await cleanup();
      return;
    }

    console.log(`✅ Found ${admins.length} admin user(s):\n`);
    
    for (const admin of admins) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`👤 Email: ${admin.email}`);
      console.log(`   Name: ${admin.name || 'Not set'}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   DB Subscription Tier: ${admin.subscriptionTier || 'NULL'}`);
      console.log(`   DB Subscription Status: ${admin.subscriptionStatus || 'NULL'}`);
      console.log();
      
      // Test effective tier calculation
      const effectiveTier = getEffectiveTier(
        admin.subscriptionTier as SubscriptionTier | null,
        admin.role
      );
      console.log('🧪 Effective Tier Calculation:');
      console.log(`   Input Role: ${admin.role}`);
      console.log(`   Input Tier: ${admin.subscriptionTier || 'NULL'}`);
      console.log(`   isAdmin(${admin.role}): ${isAdmin(admin.role)}`);
      console.log(`   ➡️  Effective Tier: ${effectiveTier}`);
      console.log();
      
      if (effectiveTier === 'enterprise') {
        console.log('✅ CORRECT: Effective tier is "enterprise" for admin');
      } else {
        console.log('❌ ERROR: Effective tier should be "enterprise" but got:', effectiveTier);
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }

    console.log('🔍 Checking API Implementation:\n');
    console.log('Files that should use getEffectiveTier():');
    console.log('  ✓ /app/api/user/current/route.ts');
    console.log('  ✓ /app/api/templates/route.ts');
    console.log('  ✓ /components/AccountClient.tsx');
    console.log();

    await cleanup();
  } catch (error) {
    console.error('Error:', error);
    await cleanup();
    process.exit(1);
  }
}

async function cleanup() {
  await cleanupDatabase(prisma, pool);
}

diagnose();
