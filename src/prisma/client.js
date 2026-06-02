require('dotenv').config();

let PrismaClient;
try {
  PrismaClient = require('../generated/prisma').PrismaClient;
} catch (e) {
  PrismaClient = require('@prisma/client').PrismaClient;
}
 
let adapterFactory;
try {
  const { PrismaPg } = require('@prisma/adapter-pg');
  adapterFactory = new PrismaPg(process.env.DATABASE_URL);
} catch (e) {
  adapterFactory = undefined;
}

const prisma = global.__prisma || new PrismaClient({ adapter: adapterFactory });
if (process.env.NODE_ENV !== 'production') global.__prisma = prisma;

const gracefulDisconnect = async () => {
  try { await prisma.$disconnect(); } catch (e) { /* ignore */ }
  process.exit(0);
};

process.on('SIGINT', gracefulDisconnect);
process.on('SIGTERM', gracefulDisconnect);

module.exports = prisma;