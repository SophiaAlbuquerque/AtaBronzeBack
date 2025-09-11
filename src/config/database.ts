import { PrismaClient } from '@prisma/client';
import { config } from './index';

const prisma = new PrismaClient({
  log: config.nodeEnv === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export { prisma };
