const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Пробуем выдать права...');

  try {
    await prisma.$executeRawUnsafe(
      'GRANT ALL ON SCHEMA public TO shtatkontrol;'
    );
    console.log('✅ Права на схему public выданы');
  } catch (e) {
    console.error('❌ Ошибка при выдаче прав на схему:', e.message);
  }

  try {
    await prisma.$executeRawUnsafe(
      'GRANT ALL PRIVILEGES ON DATABASE shtatkontrol TO shtatkontrol;'
    );
    console.log('✅ Права на базу выданы');
  } catch (e) {
    console.error('❌ Ошибка при выдаче прав на базу:', e.message);
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});