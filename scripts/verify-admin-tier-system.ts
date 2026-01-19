/**
 * End-to-end verification script for admin tier display
 * This script checks all components of the admin tier system
 */

import 'dotenv/config';
import { createScriptPrismaClient, cleanupDatabase } from '../lib/script-db';
import { getEffectiveTier, isAdmin, hasAccessToTier } from '../lib/subscription';

const { prisma, pool } = createScriptPrismaClient();

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
}

const results: TestResult[] = [];

function addResult(name: string, status: 'PASS' | 'FAIL' | 'WARN', message: string) {
  results.push({ name, status, message });
}

function printResults() {
  console.log('\n' + '═'.repeat(70));
  console.log('  END-TO-END VERIFICATION RESULTS');
  console.log('═'.repeat(70) + '\n');
  
  let passCount = 0;
  let failCount = 0;
  let warnCount = 0;
  
  results.forEach((result) => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️ ';
    console.log(`${icon} ${result.name}`);
    console.log(`   ${result.message}\n`);
    
    if (result.status === 'PASS') passCount++;
    else if (result.status === 'FAIL') failCount++;
    else warnCount++;
  });
  
  console.log('═'.repeat(70));
  console.log(`  Summary: ${passCount} passed, ${failCount} failed, ${warnCount} warnings`);
  console.log('═'.repeat(70) + '\n');
  
  if (failCount > 0) {
    console.log('⚠️  Some tests failed. Please review the failures above.');
    console.log('   See ADMIN_TIER_TROUBLESHOOTING.md for help.\n');
  } else if (warnCount > 0) {
    console.log('✓  All critical tests passed, but there are warnings.');
    console.log('   Review the warnings above for potential issues.\n');
  } else {
    console.log('🎉 All tests passed! Admin tier system is working correctly.\n');
  }
}

async function runTests() {
  console.log('\n🔍 Starting end-to-end verification...\n');
  
  try {
    // Test 1: Check for admin users
    console.log('[1/7] Checking for admin users in database...');
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionTier: true,
      }
    });
    
    if (admins.length === 0) {
      addResult(
        'Admin User Exists',
        'FAIL',
        'No admin users found in database. Run: npm run db:seed'
      );
    } else {
      addResult(
        'Admin User Exists',
        'PASS',
        `Found ${admins.length} admin user(s): ${admins.map(a => a.email).join(', ')}`
      );
    }
    
    // Test 2: Verify getEffectiveTier function
    console.log('[2/7] Testing getEffectiveTier function...');
    const testTier = getEffectiveTier(null, 'admin');
    if (testTier === 'enterprise') {
      addResult(
        'getEffectiveTier Function',
        'PASS',
        'getEffectiveTier(null, "admin") correctly returns "enterprise"'
      );
    } else {
      addResult(
        'getEffectiveTier Function',
        'FAIL',
        `getEffectiveTier(null, "admin") returned "${testTier}" instead of "enterprise"`
      );
    }
    
    // Test 3: Verify isAdmin function
    console.log('[3/7] Testing isAdmin function...');
    const adminCheck = isAdmin('admin');
    const userCheck = isAdmin('user');
    if (adminCheck && !userCheck) {
      addResult(
        'isAdmin Function',
        'PASS',
        'isAdmin() correctly identifies admin and non-admin roles'
      );
    } else {
      addResult(
        'isAdmin Function',
        'FAIL',
        `isAdmin() not working correctly. admin: ${adminCheck}, user: ${userCheck}`
      );
    }
    
    // Test 4: Verify hasAccessToTier function
    console.log('[4/7] Testing hasAccessToTier function...');
    const adminAccess = hasAccessToTier(null, 'admin', 'enterprise');
    const userNoAccess = hasAccessToTier('free', 'user', 'enterprise');
    if (adminAccess && !userNoAccess) {
      addResult(
        'hasAccessToTier Function',
        'PASS',
        'Admin correctly has access to enterprise tier, regular user does not'
      );
    } else {
      addResult(
        'hasAccessToTier Function',
        'FAIL',
        `Access control not working. Admin access: ${adminAccess}, User access: ${userNoAccess}`
      );
    }
    
    // Test 5: Check templates exist
    console.log('[5/7] Checking templates in database...');
    const templates = await prisma.template.findMany({
      where: { isActive: true },
      select: { id: true, name: true, tier: true }
    });
    
    if (templates.length === 0) {
      addResult(
        'Templates Seeded',
        'WARN',
        'No templates found. Run: npm run db:seed'
      );
    } else {
      const tiers = templates.map(t => t.tier);
      const hasEnterprise = tiers.includes('enterprise');
      addResult(
        'Templates Seeded',
        'PASS',
        `Found ${templates.length} templates${hasEnterprise ? ' including enterprise tier' : ''}`
      );
    }
    
    // Test 6: Verify database schema
    console.log('[6/7] Verifying database schema...');
    const sampleUser = await prisma.user.findFirst({
      select: {
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true,
      }
    });
    
    if (sampleUser) {
      addResult(
        'Database Schema',
        'PASS',
        'User table has required fields: role, subscriptionTier, subscriptionStatus'
      );
    } else {
      addResult(
        'Database Schema',
        'WARN',
        'No users in database to verify schema. Run: npm run db:seed'
      );
    }
    
    // Test 7: Check environment variables
    console.log('[7/7] Checking environment configuration...');
    const hasDbUrl = !!process.env.DATABASE_URL;
    const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;
    const hasNextAuthUrl = !!process.env.NEXTAUTH_URL;
    
    if (hasDbUrl && hasNextAuthSecret && hasNextAuthUrl) {
      addResult(
        'Environment Variables',
        'PASS',
        'All required environment variables are set'
      );
    } else {
      const missing = [];
      if (!hasDbUrl) missing.push('DATABASE_URL');
      if (!hasNextAuthSecret) missing.push('NEXTAUTH_SECRET');
      if (!hasNextAuthUrl) missing.push('NEXTAUTH_URL');
      addResult(
        'Environment Variables',
        'FAIL',
        `Missing environment variables: ${missing.join(', ')}`
      );
    }
    
    // Print results
    printResults();
    
    // Provide next steps
    if (admins.length > 0) {
      console.log('📋 Next Steps:');
      console.log('1. Start the development server: npm run dev');
      console.log('2. Open http://localhost:3000 in your browser');
      console.log(`3. Login with admin credentials: ${admins[0].email}`);
      console.log('4. Navigate to /account - should show "Enterprise Plan (Admin - Unlimited Access)"');
      console.log('5. Navigate to /templates - should show "Enterprise" badge, no upgrade banner\n');
    }
    
  } catch (error) {
    console.error('❌ Error running tests:', error);
    addResult('Test Execution', 'FAIL', `Error: ${error}`);
    printResults();
  } finally {
    await cleanup();
  }
}

async function cleanup() {
  await cleanupDatabase(prisma, pool);
}

runTests();
