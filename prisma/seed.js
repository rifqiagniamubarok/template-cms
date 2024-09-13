const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient({});

async function main() {
  const firstAdminPayload = {
    firstName: 'admin',
    lastName: 'admin',
    email: 'admin@yopmail.com',
    password: 'adminadmin',
  };

  firstAdminPayload.password = await bcryptjs.hash(firstAdminPayload.password, 10);
  const firstAdmin = await prisma.user.upsert({
    where: { email: firstAdminPayload.email },
    update: {},
    create: firstAdminPayload,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
