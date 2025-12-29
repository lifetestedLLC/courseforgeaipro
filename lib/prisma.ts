import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Extract the direct PostgreSQL URL from the Prisma Postgres URL
// The DATABASE_URL format is: prisma+postgres://localhost:PORT/?api_key=BASE64
// For Prisma Postgres, we use the direct connection
const directDbUrl = 'postgres://postgres:postgres@localhost:51214/template1?sslmode=disable';

// Create a connection pool
const pool = new Pool({
  connectionString: directDbUrl,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
