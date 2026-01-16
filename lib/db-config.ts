/**
 * Database configuration utility
 * Extracts the direct PostgreSQL URL from Prisma Postgres URL
 */

/**
 * Gets the direct PostgreSQL connection URL from the Prisma Postgres URL
 * Prisma Postgres URL format: prisma+postgres://localhost:PORT/?api_key=BASE64
 * The api_key contains a base64 encoded JSON with the actual database connection info
 */
export function getDirectDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL environment variable is not set.\n' +
      'Please follow these steps:\n' +
      '1. Run: npx prisma dev\n' +
      '2. Copy the DATABASE_URL from the output\n' +
      '3. Paste it into your .env file\n' +
      '4. Restart your application'
    );
  }
  
  // If it's already a direct postgres:// URL, return it as-is
  if (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')) {
    return databaseUrl;
  }
  
  // For Prisma Postgres URLs (prisma+postgres://), extract the direct URL from the API key
  if (databaseUrl.startsWith('prisma+postgres://')) {
    try {
      const url = new URL(databaseUrl);
      const apiKey = url.searchParams.get('api_key');
      
      if (!apiKey) {
        throw new Error('No api_key found in Prisma Postgres URL');
      }
      
      // Decode the base64 API key
      const decoded = JSON.parse(Buffer.from(apiKey, 'base64').toString('utf-8'));
      
      if (decoded.databaseUrl) {
        return decoded.databaseUrl;
      }
      
      throw new Error('No databaseUrl found in decoded API key');
    } catch (error) {
      console.error('Error extracting database URL from Prisma Postgres URL:', error);
      throw new Error(
        'Failed to extract database URL. Please check your DATABASE_URL configuration.\n' +
        'Make sure you copied the complete URL from `npx prisma dev` output.\n' +
        'The URL should start with: prisma+postgres://localhost:...'
      );
    }
  }
  
  throw new Error(
    `Unsupported DATABASE_URL format: ${databaseUrl.substring(0, 20)}...\n` +
    'Expected format: prisma+postgres://... or postgresql://...\n' +
    'Run `npx prisma dev` to get the correct URL for local development.'
  );
}
