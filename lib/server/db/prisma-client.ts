import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

import { PrismaClient } from '../../generated/prisma/client';

declare global {
  var __ctrlplus_prisma__: PrismaClient | undefined;
}

if (!neonConfig.webSocketConstructor) {
  neonConfig.webSocketConstructor = ws;
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required to initialize Prisma with Neon.');
  }

  const adapter = new PrismaNeon({
    connectionString,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });
}

export const prisma = globalThis.__ctrlplus_prisma__ ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__ctrlplus_prisma__ = prisma;
}
