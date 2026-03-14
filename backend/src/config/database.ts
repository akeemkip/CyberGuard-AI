import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const PLATFORM_SETTINGS_ID = 'singleton';

export default prisma;
