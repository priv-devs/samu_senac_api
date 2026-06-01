let PrismaClient;
try {
  PrismaClient = require('../src/generated/prisma').PrismaClient;
} catch (e) {
  PrismaClient = require('@prisma/client').PrismaClient;
}

const prisma = new PrismaClient();

async function main() {
  const tipos = ['cliente', 'admin', 'root'];
  for (const tipo of tipos) {
    await prisma.tipoUsuario.upsert({
      where: { tipo },
      update: {},
      create: { tipo }
    });
  }
  console.log('Seed concluido');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
