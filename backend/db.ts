import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'backend/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create a singleton Prisma client instance
const prisma = new PrismaClient();

export default prisma;