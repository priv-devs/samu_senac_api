require('../config/database');
 
let PrismaClient;
let usedGenerated = false;
try {
  PrismaClient = require('../generated/prisma').PrismaClient;
  usedGenerated = true;
} catch (e) {
  try {
    PrismaClient = require('@prisma/client').PrismaClient;
  } catch (err) {
    const missingErr = new Error([
      'Prisma client not found. Please run the following to install/generate it:',
      '1) npm i @prisma/client',
      "2) npx prisma generate",
      'If you are setting up the project for the first time you can also run: npm run prisma:generate'
    ].join('\n'));

    const stub = {
      $queryRawUnsafe: async () => { throw missingErr; },
      $executeRawUnsafe: async () => { throw missingErr; },
      $disconnect: async () => {},
    };

    module.exports = stub;
    return;
  }
}

let prisma;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
  }
  prisma = global.__prisma;
}

const shutdown = async () => {
  try {
    await prisma.$disconnect();
    console.log('Prisma disconnected');
  } catch (err) {
    console.error('Error disconnecting Prisma', err);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = prisma;
