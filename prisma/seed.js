let PrismaClient;
try {
  PrismaClient = require('../src/generated/prisma').PrismaClient;
} catch (e) {
  PrismaClient = require('@prisma/client').PrismaClient;
}

const prisma = new PrismaClient();

async function main() { 
  await prisma.usuarios.upsert({
    where: { id_user: 1 },
    update: {},
    create: {
      nome_usuario: 'admin',
      senha: 'admin',
      tipo: 'admin',
      status: 'ativo',
      email: 'admin@example.com'
    }
  });
  await prisma.usuarios.upsert({
    where: { id_user: 2 },
    update: {},
    create: {
      nome_usuario: 'user',
      senha: 'user',
      tipo: 'cliente',
      status: 'ativo',
      email: 'user@example.com'
    }
  });
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
