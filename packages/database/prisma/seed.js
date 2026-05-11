const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv/config');
const argon2 = require('argon2');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@egresadosconnect.com';
  const passwordHash = await argon2.hash('admin123');

  const usuario = await prisma.usuario.upsert({
    where: { email },
    update: {
      passwordHash,
      rol: 'ADMINISTRADOR',
      estado: 'ACTIVO',
      proveedorAuth: 'CREDENCIALES',
      emailVerificadoEn: new Date(),
    },
    create: {
      email,
      passwordHash,
      rol: 'ADMINISTRADOR',
      estado: 'ACTIVO',
      proveedorAuth: 'CREDENCIALES',
      emailVerificadoEn: new Date(),
    },
  });

  await prisma.administrador.upsert({
    where: { id: usuario.id },
    update: {
      nombreCompleto: 'Administrador Principal',
      area: 'Sistemas',
    },
    create: {
      id: usuario.id,
      nombreCompleto: 'Administrador Principal',
      area: 'Sistemas',
    },
  });

  console.log(`Administrador listo: ${email}`);
}

main()
  .catch((error) => {
    console.error('Error ejecutando el seed del administrador', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
