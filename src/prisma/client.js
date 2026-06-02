const { databaseUrl } = require('../config/database');

let PrismaClient;
try {
  PrismaClient = require('../generated/prisma').PrismaClient;
} catch (e) {
  PrismaClient = require('@prisma/client').PrismaClient;
}

const prismaOptions = { adapter: { provider: 'postgres', url: databaseUrl } };
const prisma = (process.env.NODE_ENV === 'production') ? new PrismaClient(prismaOptions) : (global.__prisma || (global.__prisma = new PrismaClient(prismaOptions)));
process.on('SIGINT', async () => { await prisma.$disconnect(); });
process.on('SIGTERM', async () => { await prisma.$disconnect(); });

module.exports = prisma;