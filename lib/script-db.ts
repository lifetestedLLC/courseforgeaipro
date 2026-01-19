/**
 * Shared database utility for scripts
 * Provides consistent database connection setup for diagnostic and maintenance scripts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getDirectDatabaseUrl } from './db-config';

/**
 * Create a Prisma client with proper adapter configuration
 * This ensures scripts use the same connection pattern as the main application
 */
export function createScriptPrismaClient() {
  const directDbUrl = getDirectDatabaseUrl();
  const pool = new Pool({ connectionString: directDbUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  
  return { prisma, pool };
}

/**
 * Cleanup function to properly close database connections
 * Call this before exiting scripts to prevent hanging connections
 */
export async function cleanupDatabase(prisma: PrismaClient, pool: Pool) {
  await prisma.$disconnect();
  await pool.end();
}
